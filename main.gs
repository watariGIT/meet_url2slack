function myFunction() {
  
  event = get_event(10*60) //10min
  
  //eventが存在しなければ終了
  if(typeof event === "undefined"){
    Logger.log("Not Found Event");
    return 0
  }
  
  // すでに予定が開始していないかを確認
  start_time = new Date(event.start.dateTime)
  if(start_time.getTime() < new Date().getTime()){
    Logger.log("Event Started");
    Logger.log(event);
    return 0
  }
  
  post_slack(create_message(event))
  Logger.log("Post　Slack");
  
}

function get_event(interval_sec){

  var start = new Date();
  var end = new Date(start.getTime() + interval_sec * 1000);
  var calendarId =  Session.getActiveUser().getUserLoginId();

  var events = Calendar.Events.list(calendarId, {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true, // 繰り返しの予定も含める
    orderBy: 'startTime',
    maxResults: 5
  });
  
  var event = events.items[0];
  return event;
}

function create_message(event){
  var title = event.summary
  var hangoutLink = event.hangoutLink
  var start = Utilities.formatDate(new Date(event.start.dateTime), 'Asia/Tokyo', 'HH:mm'); 
  var end   = Utilities.formatDate(new Date(event.end.dateTime), 'Asia/Tokyo', 'HH:mm');

  var message =start + ' ~ ' + end  +' *[' + title + ']* \n' 
               + 'meet_url: '+ hangoutLink;
  Logger.log("message: " + message);
  return message;
}

function post_slack(message){
  var postUrl = ''; //Incoming Webhook URL
  var params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({text: message})
  }; 
  
  UrlFetchApp.fetch(postUrl, params);        
}