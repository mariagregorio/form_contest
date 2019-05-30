let initial_data = {
	'project_name': null,
	'project_desc': null,
	'project_questions': 1,
	'project_startdate': null,
	'project_enddate': null,
	'project_created': null,
	'project_response_goal': 0,
	'project_starttime': null,
	'project_endtime': null,
	'trunk_id': null,
	'is_linear': false,
	'amd_enabled': true,
	'project_timeout': 30,
	'project_channels': 1,
	'project_volume': 0.25,
	'project_user': null,
}


function toggleSkipLogic(event) {
	let value = event.target.id;
	if (value=='skip_logic_yes') {
		document.getElementById('skip_logic_yes').classList.add('selected');
		document.getElementById('skip_logic_no').classList.remove('selected');
		initial_data.is_linear = true;
	} else if (value=='skip_logic_no') {
		document.getElementById('skip_logic_yes').classList.remove('selected');
		document.getElementById('skip_logic_no').classList.add('selected');
		initial_data.is_linear = false;
	}
}
function toggleEnableAMD(event) {
	let value = event.target.id;
	if (value=='enable_amd_yes') {
		document.getElementById('enable_amd_yes').classList.add('selected');
		document.getElementById('enable_amd_no').classList.remove('selected');
		initial_data.amd_enabled = true;
	} else if (value=='enable_amd_no') {
		document.getElementById('enable_amd_yes').classList.remove('selected');
		document.getElementById('enable_amd_no').classList.add('selected');
		initial_data.amd_enabled = false;
	}
}

function questionsCount(operation) {
	let num_questions = parseInt(document.getElementById('num_questions').value);
	if (operation == 'sum') {
		num_questions += 1;
	} else if (operation == 'substract' && num_questions > 1) {
		num_questions -= 1;
	}
	document.getElementById('num_questions').value = num_questions;
	initial_data.project_questions = num_questions;
}

function responseGoalCount(operation) {
	let response_goal = parseInt(document.getElementById('response_goal').value);
	if (operation == 'sum') {
		response_goal += 25;
	} else if (operation == 'substract' && response_goal >= 25) {
		response_goal -= 25;
	}
	document.getElementById('response_goal').value = response_goal;
	initial_data.project_response_goal = response_goal;
}

function updateTimeoutDisplay(event) {
	let display = document.getElementById('timeoutDisplay');
	let ringsDisplay = document.getElementById('timeoutRingsDisplay');
	display.innerText = event.target.value;

	ringsDisplay.innerText = parseInt(event.target.value) / 6;
	initial_data.project_timeout = parseInt(event.target.value);
}
function updateVolumeDisplay(event) {
	let display = document.getElementById('volumeDisplay');
	display.innerText = parseInt(event.target.value);
	initial_data.project_volume = parseInt(event.target.value)/100;
}


function updateChannels(event) {
	if (event.target.value == 'Trunk name') {
		document.getElementById('channels').value = 9;
		document.getElementById('channelsDisplay').innerText = '9';
		initial_data.project_channels = 9;
	} else {
		document.getElementById('channels').value = 1;
		document.getElementById('channelsDisplay').innerText = '1';
		initial_data.project_channels = 1;
	}
		
}












// START SURVEY SUBMIT
function generateSurvey() {
	let project_name = document.getElementById('survey_short_name').value;
	let project_desc = document.getElementById('survey_description').value;
	let project_questions = document.getElementById('num_questions').value;
	let project_startdate = document.getElementById('start_date').value;
	let project_enddate = document.getElementById('end_date').value;
	let project_created = document.getElementById('create_date').value;
	let project_response_goal = document.getElementById('response_goal').value;
	let project_starttime = document.getElementById('start_time').value;
	let project_endtime = document.getElementById('end_time').value;

	initial_data.project_user = 0;

	initial_data.project_name = project_name;
	initial_data.project_desc = project_desc;
	initial_data.project_questions = project_questions;
	initial_data.project_response_goal = project_response_goal;
	initial_data.project_starttime = project_starttime;
	initial_data.project_endtime = project_endtime;
	initial_data.project_startdate = project_startdate;
	initial_data.project_enddate = project_enddate;
	initial_data.project_created = project_created;

	console.log(initial_data);

	if (form_start_survey.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
  	console.log('it\'s ok to proceed');
  	// hide or show forms
  	form_start_survey.classList.add('hide');
		form_basic_details.classList.remove('hide');

		// create question tabs
		let form_tabs = document.getElementById('form_tabs');
		let form_tabs_HTML = form_tabs.innerHTML;
  	let i;
  	for (i=0; i < parseInt(project_questions); i++) {
  		form_tabs.innerHTML += '<li class="nav-item"><a class="nav-link disabled" id="tab_question_' + (i + 1) + '" href="#">Question ' + (i + 1) + '</a></li>';
  	}

		// update tabs classes
		tab_start_survey.classList.add('disabled')
		tab_start_survey.classList.remove('active');
  	tab_basic_details.classList.add('active')
  	tab_basic_details.classList.remove('disabled');
  }
  form_start_survey.classList.add('was-validated');
}






// DATE AND TIME PICKERS
let start_date_dp = $('#start_date').datepicker().data('datepicker');
let end_date_dp = $('#end_date').datepicker().data('datepicker');
let create_date_dp = $('#create_date').datepicker().data('datepicker');

$('#start_date_input').on('click', function(){
    start_date_dp.show();
});
$('#end_date_input').on('click', function(){
    end_date_dp.show();
});
$('#create_date_input').on('click', function(){
    create_date_dp.show();
});


$('#start_time_input').on('click', function(){
    $('#start_time').timepicker('show');
});
$('#end_time_input').on('click', function(){
    $('#end_time').timepicker('show');
});








// DOCUMENT READY
$( document ).ready(function() {

	// set up date & time pickers

  $('#start_time').timepicker({ 'timeFormat': 'H:i' });
  $('#end_time').timepicker({ 'timeFormat': 'H:i' });

  $('#start_date').datepicker({
  	'autoClose': true,
  	'dateFormat': 'yyyy-mm-dd'
  });
  $('#end_date').datepicker({
  	'autoClose': true,
  	'dateFormat': 'yyyy-mm-dd'
  });
  $('#create_date').datepicker({
  	'autoClose': true,
  	'dateFormat': 'yyyy-mm-dd'
  });


  // set up forms visibility

  let form_start_survey = document.getElementById('form_start_survey'); 
  let form_basic_details = document.getElementById('form_basic_details'); 

  let tab_start_survey = document.getElementById('tab_start_survey'); 
  let tab_basic_details = document.getElementById('tab_basic_details'); 

// changed this for development purpouses
  form_start_survey.classList.add('hide');
  form_basic_details.classList.add('show');


  tab_start_survey.classList.add('active');
  tab_basic_details.classList.add('disabled');

});



function updateFilesList() {
	// file upload input logic
  let input = document.getElementById('file_upload_input');
	let list = document.getElementById('files_list');
	let i;
	for (i=0; i < input.files.length; i++) {
		//add to list
		let li = document.createElement('li');
		li.classList.add('list-group-item');
		li.innerHTML = '<div class="file" id="file_' + i + '"><p>' + input.files[i].name +
		 '</p><p class="size">' + input.files[i].size + ' bytes</p></div><div class="delete-file" id="del_' + i +
		 '"><i class="fas fa-trash-alt"></i></div>';
		list.append(li);
	}
}