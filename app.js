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
};

let basic_details = {
	'base_project_id': 'AR0001',
	'response_tracking_question': null,
	'intro_audio_original': null,
	'hangup_audio_original': null
};

let questions = [];

let questions_dtmf = [];


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

	if (form_start_survey.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
  	console.log('proceed to basic details');
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

  	// create question forms
  	let question_forms_wrapper = document.getElementById('question_forms_wrapper');
  	for (i=0; i < parseInt(project_questions); i++) {
  		console.log('got here');
  		let question_form = document.createElement('form');
  		question_form.setAttribute('id', 'question_form_' + (i+1));
  		question_form.setAttribute('action', 'javascript:void(0)');
  		question_form.setAttribute('autocomplete', 'off');
  		question_form.classList.add('hide');

  		question_forms_wrapper.append(question_form);

  		// populate response tracking question input
  		let response_tracking_select = document.getElementById('response_tracking');
  		let option = document.createElement('option');
  		option.setAttribute('value', i + 1);
  		response_tracking_select.append(option);
  		option.innerHTML = 'Question ' + (i+1);
  	}

		// update tabs classes
		tab_start_survey.classList.add('disabled')
		tab_start_survey.classList.remove('active');
  	tab_basic_details.classList.add('active')
  	tab_basic_details.classList.remove('disabled');
  }
  form_start_survey.classList.add('was-validated');

  console.log(initial_data);
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

  form_start_survey.classList.add('show');
  form_basic_details.classList.add('hide');

  tab_start_survey.classList.add('active');
  tab_basic_details.classList.add('disabled');

});

let uploadedFiles = [];

function updateFilesList() {
	// file upload input logic
  let input = document.getElementById('file_upload_input');
	let list = document.getElementById('files_list');
	let i;
	for (i=0; i < input.files.length; i++) {
		//add to list
		uploadedFiles.push(input.files[i].name);
		//add to list in dom
		let li = document.createElement('li');
		li.classList.add('list-group-item', 'clearfix');
		li.innerHTML = '<div class="file float-left" id="file_' + i + '"><p>' + input.files[i].name +
		 '</p><p class="size">' + input.files[i].size + ' bytes</p></div><div class="delete-file float-right" onclick="removeFile(\'file_' 
		 + i + '\', \''+ input.files[i].name + '\')" id="del_' + i + '"><i class="fas fa-trash-alt"></i></div>';
		list.append(li);
	}
	updateIntroHangupAudioSelect();
}

function removeFile(fileID, fileName) {
	let input = document.getElementById('file_upload_input');
	let elem = document.getElementById(fileID);
	elem.parentNode.remove();
	for (let i=0; i < uploadedFiles.length; i++) {
		if (fileName == uploadedFiles[i]) {
			uploadedFiles.splice(i, 1);
		}
	}
	updateIntroHangupAudioSelect();
}

function updateIntroHangupAudioSelect() {
	let intro_group = document.getElementById('intro_audio_group');
	let hangup_group = document.getElementById('hangup_audio_group');
	intro_group.classList.add('show');
	intro_group.classList.remove('hide');
	hangup_group.classList.add('show');
	hangup_group.classList.remove('hide');

	let intro_select = document.getElementById('intro_audio');
	let hangup_select = document.getElementById('hangup_audio');

	intro_select.innerHTML = '';
	hangup_select.innerHTML = '';

	for (let i=0; i < uploadedFiles.length; i++) {
		let el = document.createElement('option');
		let el2 = document.createElement('option');
		el.setAttribute('value', uploadedFiles[i]);
		el2.setAttribute('value', uploadedFiles[i]);
		el.innerHTML = uploadedFiles[i];
		el2.innerHTML = uploadedFiles[i];
		intro_select.append(el);
		hangup_select.append(el2);
	}

}


function saveBasicDetails() {
	let response_tracking = document.getElementById('response_tracking');
	let intro_audio = document.getElementById('intro_audio');
	let hangup_audio = document.getElementById('hangup_audio');

	basic_details.response_tracking_question = response_tracking.value;
	basic_details.intro_audio_original = intro_audio.value;
	basic_details.hangup_audio_original = hangup_audio.value;

	console.log(basic_details);
}



function goToQuestion(questionNum) {
	let form = document.getElementById('question_form_' + questionNum);

	if (questionNum == 1) {
		if (form_basic_details.checkValidity() === false) {
	    event.preventDefault();
	    event.stopPropagation();
	  } else {
	  	console.log('proceed to question 1');
	  	form.classList.remove('hide');
	  	let form_basic_details = document.getElementById('form_basic_details');
			form_basic_details.classList.add('hide');

			let question_tab = document.getElementById('tab_question_' + questionNum);
			let tab_basic_details = document.getElementById('tab_basic_details');

			tab_basic_details.classList.remove('active');
			tab_basic_details.classList.add('disabled');
			question_tab.classList.remove('disabled');
			question_tab.classList.add('active');
	  }
	} else {
		form.classList.remove('hide');
		let question_tab = document.getElementById('tab_question_' + questionNum);
		let question_tab_last = document.getElementById('tab_question_' + (questionNum - 1));
		question_tab_last.classList.remove('active');
		question_tab_last.classList.add('disabled');
		question_tab.classList.remove('disabled');
		question_tab.classList.add('active');

		let form_last = document.getElementById('question_form_' + (questionNum - 1));
		form_last.classList.add('hide');
	}

	let row = document.createElement('div');
	row.classList.add('row');
	let col4 = document.createElement('div');
	let col8 = document.createElement('div');
	col4.classList.add('col-sm-4');
	col8.classList.add('col-sm-8');

	let form_group_1 = document.createElement('div');
	let form_group_2 = document.createElement('div');
	let form_group_3 = document.createElement('div');

	let audio_options_list_HTML = '';
	let audio_n;
	for (audio_n = 0; audio_n < uploadedFiles.length; audio_n++) {
		audio_options_list_HTML += '<option value="'+ uploadedFiles[audio_n] +'">'+ uploadedFiles[audio_n] +'</option>';
	}

	form_group_1.innerHTML = '<div class="form-group"><label for="question_audio">Question audio</label><select id="question_audio'+ questionNum +'" class="form-control">'+ audio_options_list_HTML + '</select></div>';
	form_group_2.innerHTML = '<div class="form-group"><label for="question_prompt">Question prompt</label><input type="text" id="question_prompt'+ questionNum +'" class="form-control"></div>';
	form_group_3.innerHTML = '<div class="form-group"><label for="question_label">Question label</label><input type="text" id="question_label'+ questionNum +'" class="form-control"></div>';

	col4.append(form_group_1);
	col4.append(form_group_2);
	col4.append(form_group_3);

	// if skip logic is on, show DTMF form
	if (initial_data.is_linear == true) {
		let dtmf_row = document.createElement('div');
		dtmf_row.classList.add('dtmf-row', 'row');
		dtmf_row.innerHTML = '';
		// create dmtf cells and append to row
		for (let i=0; i < 12; i++) {
			dtmf_row.innerHTML += '<div class="col-4"><div class="card dtmf-cell"><div class="card-body"><div class="clearfix"><div class="float-left"><label><input type="checkbox" id="dtmf_check_'+ questionNum +'_' + (i + 1) + '" class="check-custom" onclick="updateDTMFStatus(event, ' + (i + 1) + ', ' + questionNum + ')"><span class="check-toggle"><span class="check-mark"></span></span></label></div><p class="float-right">DTMF ' + (i + 1) + '</p></div></div></div></div>'
		}
		col8.append(dtmf_row);
	}

	row.append(col4);
	row.append(col8);

	form.append(row);

	// check for last question and add last step button
	if (questionNum != initial_data.project_questions) {
		let next_btn = document.createElement('div');
		next_btn.classList.add('next-wrapper');
		next_btn.innerHTML = '<div class="next-wrapper"><button type="submit" class="btn btn-primary" id="btn_next_step' + (questionNum) + '" onclick="goToQuestion(' + (questionNum + 1) + '); saveQuestion('+ questionNum +')">Next step</button></div>';

		form.append(next_btn);
	} else {
		let finish_btn = document.createElement('div');
		finish_btn.classList.add('next-wrapper');
		finish_btn.innerHTML = '<div class="next-wrapper"><button type="submit" class="btn btn-primary" id="finish_btn" onclick="finish(); saveQuestion('+ questionNum +')">Preview and save</button></div>';

		form.append(finish_btn);
	}
}



function saveQuestion(num) {
	// get data from form

	let form = document.getElementById('question_form_' + num);
	let question_file = document.getElementById('question_audio' + num);
	let question_prompt = document.getElementById('question_prompt' + num);
	let question_label = document.getElementById('question_label' + num);

	let question_dtmfs = [];

	if (initial_data.is_linear == true) {
		for(let i=0; i < 12; i++) {
			let dtmf_values;
			let dtmf_check = document.getElementById('dtmf_check_' + num + '_' + (i+1));
			let dtmf_text = document.getElementById('dtmf_text_' + num + '_' + (i+1));
			let dtmf_select = document.getElementById('dtmf_select_' + num + '_' + (i+1));

			if (dtmf_text != null && dtmf_select != null) {
				dtmf_values = [dtmf_check.checked, dtmf_text.value, dtmf_select.value];
			} else if (dtmf_text != null && dtmf_select == null) {
				dtmf_values = [dtmf_check.checked, dtmf_text.value];
			} else {
				dtmf_values = dtmf_check.checked;
			}
			
			question_dtmfs.push(dtmf_values);
		}
	}

	// save question data in questions array

	let question = {
		'question_id': num,
		'question_file': question_file.value,
		'question_prompt': question_prompt.value,
		'question_label': question_label.value,
		'question_dtmfs': question_dtmfs
	}

	questions.push(question);

	console.log(questions);
}



function finish() {
	let last_question_form = document.getElementById('question_form_' + initial_data.project_questions);
	last_question_form.classList.add('hide');

	let question_tab = document.getElementById('tab_question_' + initial_data.project_questions);
	question_tab.classList.add('disabled');
	question_tab.classList.remove('active');

	let preview = document.getElementById('preview');
	preview.classList.remove('hide');
}





function updateDTMFStatus(event, dtmf_num, question) {
	let el = event.target;

	let form_container = document.createElement('div');
	form_container.classList.add('hide');
	form_container.innerHTML = '<div class="form-group"><input type="text" id="dtmf_text_'+ question +'_' + dtmf_num + '" class="form-control"></div>'
	
	el.parentNode.parentNode.parentNode.parentNode.append(form_container);

	// if this is not the last question, include select in skip logic
	if (question != initial_data.project_questions) {
		form_container.innerHTML += '<div class="form-group"><select name="" id="dtmf_select_'+ question +'_' + dtmf_num + '" class="form-control"></select></div>';

		let dtmf_select = document.getElementById('dtmf_select_'+ question +'_' + dtmf_num);

		for (let i=0; i < initial_data.project_questions; i++) {
			dtmf_select.innerHTML += '<option value="question_' + (i+1) + '">Go to Question ' + (i+1) + '</option>';
		}
	}

	// if checked, show the form
	if(el.checked) {
		form_container.classList.remove('hide');
	} else {
		form_container.classList.add('hide');
	}
}