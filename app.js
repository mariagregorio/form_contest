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
	'multi_trunk': []
};

let basic_details = {
	'base_project_id': 'autogenerated',
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
	} else if (operation == 'substract' && num_questions > 0) {
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
	let value = parseInt(event.target.value);
	let channelsRangeInput = document.getElementById('channels');
	channelsRangeInput.setAttribute('max', value);
	channelsRangeInput.value = value;
	document.getElementById('channelsDisplay').innerText = value;

	initial_data.trunk_id = value;
}

function setChannels(event) {
	initial_data.project_channels = parseInt(event.target.value);
	document.getElementById('channelsDisplay').innerText = event.target.value;
}

function updateChannelsValue(op) {
	let channelsRangeInput = document.getElementById('channels');

	if (op == 'plus') {
		channelsRangeInput.value = parseInt(channelsRangeInput.value) + 1;
	} else if (op == 'minus') {
		channelsRangeInput.value -= 1;
	}
	document.getElementById('channelsDisplay').innerText = channelsRangeInput.value;
}


// START SURVEY SUBMIT
function generateSurvey() {
	let project_name = document.getElementById('survey_short_name').value;
	let project_desc = document.getElementById('survey_description').value;
	let project_questions = document.getElementById('num_questions').value;
	let project_startdate = document.getElementById('start_date').value;
	let project_enddate = document.getElementById('end_date').value;
	let project_created = new Date();
	let project_response_goal = document.getElementById('response_goal').value;
	let project_starttime = document.getElementById('start_time').value;
	let project_endtime = document.getElementById('end_time').value;

	let project_trunk = document.getElementById('trunk').value;

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
	initial_data.project_trunk = project_trunk;

	console.log(initial_data.project_trunk);

	if (form_start_survey.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
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
  		let question_form = document.createElement('form');
  		question_form.setAttribute('id', 'question_form_' + (i+1));
  		question_form.setAttribute('action', 'javascript:void(0)');
			question_form.setAttribute('autocomplete', 'off');
			question_form.classList.add('hide', 'needs-validation');
			question_form.noValidate = true;

  		question_forms_wrapper.append(question_form);

  		// populate response tracking question input
  		let response_tracking_select = document.getElementById('response_tracking');
  		let option = document.createElement('option');
  		option.setAttribute('value', i + 1);
  		if (i == (project_questions-1)) {
  			option.selected = true;
  		}
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
}



// DATE AND TIME PICKERS
let start_date_dp = $('#start_date').datepicker().data('datepicker');
let end_date_dp = $('#end_date').datepicker().data('datepicker');

$('#start_date_input').on('click', function(){
    start_date_dp.show();
});
$('#end_date_input').on('click', function(){
	if (end_date_picker.disabled == false) {
		end_date_dp.show();
	}
});


$('#start_time_input').on('click', function(){
    $('#start_time').timepicker('show');
});
$('#end_time_input').on('click', function(){
    $('#end_time').timepicker('show');
});






let end_date_picker = document.getElementById('end_date');
let min_end_date = new Date();


let startTime = new Date(2019, 5, 6, 9, 0, 0);
let endTime = new Date(2019, 5, 6, 21, 0, 0);

// DOCUMENT READY
$( document ).ready(function() {

	let today = new Date();
	document.getElementById('created_date').innerHTML = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();


	// set up date & time pickers

  $('#start_time').timepicker({ 'timeFormat': 'H:i'});
  $('#end_time').timepicker({ 'timeFormat': 'H:i' });

  $('#start_time').timepicker('setTime', startTime);
  $('#end_time').timepicker('setTime', endTime);



  $('#start_date').datepicker({
  	'autoClose': true,
  	'dateFormat': 'yyyy-mm-dd',
  	'startDate': today,
  	'minDate': today,
  	'onSelect': function (fd, d, picker) {
        end_date_picker.disabled = false;
        let aDate = document.getElementById('start_date').value;
        aDate = aDate.split('-');
        min_end_date = new Date(aDate[0], aDate[1]-1, aDate[2]);
		$('#end_date').datepicker({
			'autoClose': true,
			'dateFormat': 'yyyy-mm-dd',
			'minDate': min_end_date
		});
    }
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

	let none1 = document.createElement('option');
	let none2 = document.createElement('option');

	none1.innerHTML = '';
	none2.innerHTML = '';
	none1.disabled = true;
	none2.disabled = true;
	none1.selected = true;
	none2.selected = true;

	intro_select.append(none1);
	hangup_select.append(none2);

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
}



function goToQuestion(questionNum) {

	if (initial_data.project_questions == 0) {
		if (form_basic_details.checkValidity() === false) {
	    event.preventDefault();
			event.stopPropagation();
	  } else {
			let form_basic_details = document.getElementById('form_basic_details');
			form_basic_details.classList.add('hide');
			let tab_basic_details = document.getElementById('tab_basic_details');
	
			tab_basic_details.classList.remove('active');
			tab_basic_details.classList.add('disabled');
			saveBasicDetails();
			finish();
			return;
		}
		form_basic_details.classList.add('was-validated');

	}

	// CREATE THE FORM AND CONTENT
	let form = document.getElementById('question_form_' + questionNum);

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

	form_group_1.innerHTML = '<div class="form-group"><label for="question_audio">Question audio</label><select id="question_audio'+ questionNum +'" class="form-control" required><option disabled selected></option>'+ audio_options_list_HTML + '</select><div class="invalid-feedback">Required field.</div></div>';
	form_group_2.innerHTML = '<div class="form-group"><label for="question_prompt">Question prompt</label><input type="text" id="question_prompt'+ questionNum +'" class="form-control" required><div class="invalid-feedback">Required field.</div></div>';
	form_group_3.innerHTML = '<div class="form-group"><label for="question_label">Question label</label><input type="text" id="question_label'+ questionNum +'" class="form-control" onchange="validateQuestionLabel(event)" required><div class="invalid-feedback">Required field.<br/>Question label must be unique.</div></div>';

	col4.append(form_group_1);
	col4.append(form_group_2);
	col4.append(form_group_3);


	let dtmf_row = document.createElement('div');
	dtmf_row.classList.add('dtmf-row', 'row');
	dtmf_row.innerHTML = '';
	// create dmtf cells and append to row
	for (let i=0; i < 12; i++) {
		if (i < 9) {
			dtmf_row.innerHTML += '<div class="col-4"><div class="card dtmf-cell"><div class="card-body"><div class="clearfix"><div class="float-left"><label><input type="checkbox" id="dtmf_check_'+ questionNum +'_' + (i + 1) + '" class="check-custom" onclick="updateDTMFStatus(event, ' + (i + 1) + ', ' + questionNum + ')"><span class="check-toggle"><span class="check-mark"></span></span></label></div><p class="float-right">DTMF ' + (i + 1) + '</p></div></div></div></div>';
		} else if ( i == 9 ) {
			dtmf_row.innerHTML += '<div class="col-4"><div class="card dtmf-cell"><div class="card-body"><div class="clearfix"><div class="float-left"><label><input type="checkbox" id="dtmf_check_'+ questionNum +'_' + (i + 1) + '" class="check-custom" onclick="updateDTMFStatus(event, ' + (i + 1) + ', ' + questionNum + ')"><span class="check-toggle"><span class="check-mark"></span></span></label></div><p class="float-right">DTMF *</p></div></div></div></div>';
		} else if ( i == 10 ) {
			dtmf_row.innerHTML += '<div class="col-4"><div class="card dtmf-cell"><div class="card-body"><div class="clearfix"><div class="float-left"><label><input type="checkbox" id="dtmf_check_'+ questionNum +'_' + (i + 1) + '" class="check-custom" onclick="updateDTMFStatus(event, ' + (i + 1) + ', ' + questionNum + ')"><span class="check-toggle"><span class="check-mark"></span></span></label></div><p class="float-right">DTMF 0</p></div></div></div></div>';
		} else if ( i == 11 ) {
			dtmf_row.innerHTML += '<div class="col-4"><div class="card dtmf-cell"><div class="card-body"><div class="clearfix"><div class="float-left"><label><input type="checkbox" id="dtmf_check_'+ questionNum +'_' + (i + 1) + '" class="check-custom" onclick="updateDTMFStatus(event, ' + (i + 1) + ', ' + questionNum + ')"><span class="check-toggle"><span class="check-mark"></span></span></label></div><p class="float-right">DTMF #</p></div></div></div></div>';
		}
		
	}
	col8.append(dtmf_row);
	

	row.append(col4);
	row.append(col8);

	// APPEND FORM CONTENT
	form.append(row);

		// check for last question and add last step button
		if (questionNum != initial_data.project_questions) {
			let next_btn = document.createElement('div');
			next_btn.classList.add('next-wrapper');
			next_btn.innerHTML = '<div class="next-wrapper"><button type="submit" class="btn btn-primary" id="btn_next_step' + (questionNum) + '" onclick="goToQuestion(' + (questionNum + 1) + ')">Next step</button></div>';
	
			form.append(next_btn);
		} else {
			let finish_btn = document.createElement('div');
			finish_btn.classList.add('next-wrapper');
			finish_btn.innerHTML = '<div class="next-wrapper"><button type="submit" class="btn btn-primary" id="finish_btn" onclick="finish()">Preview and save</button></div>';
	
			form.append(finish_btn);
		}

	if (questionNum == 1) {
		if (form_basic_details.checkValidity() === false) {
	    event.preventDefault();
			event.stopPropagation();
			//reload form
			form.innerHTML = '';
	  } else {
	  	form.classList.remove('hide');
	  	let form_basic_details = document.getElementById('form_basic_details');
			form_basic_details.classList.add('hide');

			let question_tab = document.getElementById('tab_question_' + questionNum);
			let tab_basic_details = document.getElementById('tab_basic_details');

			tab_basic_details.classList.remove('active');
			tab_basic_details.classList.add('disabled');
			question_tab.classList.remove('disabled');
			question_tab.classList.add('active');
			saveBasicDetails();
		}
		form_basic_details.classList.add('was-validated');
	}

	if(questionNum > 1) {
		let actual_question = questionNum - 1;
		let actual_form = document.getElementById('question_form_' + actual_question.toString());

		if (actual_form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			//reload form
			form.innerHTML = '';
		} else {
			saveQuestion(questionNum - 1);
			form.classList.remove('hide');
			let question_tab = document.getElementById('tab_question_' + questionNum);
			let question_tab_last = document.getElementById('tab_question_' + (questionNum - 1));
			question_tab_last.classList.remove('active');
			question_tab_last.classList.add('disabled');
			question_tab.classList.remove('disabled');
			question_tab.classList.add('active');

			let form_last = document.getElementById('question_form_' + (questionNum - 1));
			form_last.classList.add('hide');
			form_last.classList.remove('show');
		}
		actual_form.classList.add('was-validated');
	}
}



function saveQuestion(num) {
	// get data from form

	let form = document.getElementById('question_form_' + num);
	let question_file = document.getElementById('question_audio' + num);
	let question_prompt = document.getElementById('question_prompt' + num);
	let question_label = document.getElementById('question_label' + num);

	let question_dtmfs = [];

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
	
	// save question data in questions array
	let question = {
		'question_id': num,
		'question_file': question_file.value,
		'question_prompt': question_prompt.value,
		'question_label': question_label.value,
		'question_dtmfs': question_dtmfs
	}

	questions.push(question);
}


function previewForm() {
	// get elements from preview template and insert the values from the form
	let prev_survey_id = document.getElementById('prev_survey_id');
	let prev_survey_name = document.getElementById('prev_survey_name');
	let prev_survey_desc = document.getElementById('prev_survey_desc');
	let prev_questions_number = document.getElementById('prev_questions_number');
	let prev_response_goal = document.getElementById('prev_response_goal');
	let prev_audio_volume = document.getElementById('prev_audio_volume');
	let prev_survey_created = document.getElementById('prev_survey_created');
	let prev_survey_start_date = document.getElementById('prev_survey_start_date');
	let prev_survey_end_date = document.getElementById('prev_survey_end_date');
	let prev_survey_startend_time = document.getElementById('prev_survey_startend_time');
	let prev_skip_logic = document.getElementById('prev_skip_logic');
	let prev_enable_amd = document.getElementById('prev_enable_amd');
	let prev_timeout = document.getElementById('prev_timeout');
	let prev_channels = document.getElementById('prev_channels');
	let prev_trunk = document.getElementById('prev_trunk');
	let prev_response_tracking_question = document.getElementById('prev_response_tracking_question');
	let prev_intro_audio_file = document.getElementById('prev_intro_audio_file');
	let prev_hangup_audio_file = document.getElementById('prev_hangup_audio_file');

	prev_survey_id.innerHTML = basic_details.base_project_id;
	prev_survey_name.innerHTML = initial_data.project_name;
	prev_survey_desc.innerHTML = initial_data.project_desc;
	prev_questions_number.innerHTML = initial_data.project_questions;
	prev_response_goal.innerHTML = initial_data.project_response_goal;
	prev_audio_volume.innerHTML = initial_data.project_volume;
	prev_survey_created.innerHTML = initial_data.project_created;
	prev_survey_start_date.innerHTML = initial_data.project_startdate;
	prev_survey_end_date.innerHTML = initial_data.project_enddate;
	prev_survey_startend_time.innerHTML = initial_data.project_starttime + ' - ' + initial_data.project_endtime;
	if (initial_data.is_linear == true) {
		prev_skip_logic.innerHTML = 'Yes';
	} else {
		prev_skip_logic.innerHTML = 'No';
	}
	if (initial_data.amd_enabled == true) {
		prev_enable_amd.innerHTML = 'Yes';
	} else {
		prev_enable_amd.innerHTML = 'No';
	}
	prev_timeout.innerHTML = initial_data.project_timeout;
	prev_channels.innerHTML = initial_data.project_channels;
	prev_trunk.innerHTML = initial_data.trunk_id;
	prev_response_tracking_question.innerHTML = basic_details.response_tracking_question;
	prev_intro_audio_file.innerHTML = basic_details.intro_audio_original;
	prev_hangup_audio_file.innerHTML = basic_details.hangup_audio_original;

if (initial_data.project_questions > 0) {
		let questions_table_body = document.getElementById('questions_table_body');

	for (let i=0; i < questions.length; i++) {
		let tr = document.createElement('tr');
		tr.setAttribute('id', 'tr_question_' + (i+1));
		questions_table_body.append(tr);


		let tr_dtmf = document.createElement('tr');
		tr_dtmf.setAttribute('id', 'tr_dtmf_question_' + (i+1));
		tr_dtmf.classList.add('dtmf-tr');
		questions_table_body.append(tr_dtmf);
		tr_dtmf.innerHTML = '<td></td><td colspan="3"><table class="table-borderless" id="dtmf_table_question'+ (i+1) +'"></table></td>';
		let dtmf_table = document.getElementById('dtmf_table_question'+ (i+1));
		dtmf_table.innerHTML = '';
		for (let j=0; j < questions[i].question_dtmfs.length; j++) {
			if(questions[i].question_dtmfs[j] != false) {
				dtmf_table.innerHTML += '<tr><td>DTMF '+ (j+1) +'</td><td>'+ questions[i].question_dtmfs[j][1] +'</td><td>Go to '+ questions[i].question_dtmfs[j][2] +'</td></tr>';
			}
		}

		tr.innerHTML = '<th scope="row">'+ (i+1) +'</th><td>'+ questions[i].question_prompt +'</td><td><i class="far fa-file-audio"></i> '+ questions[i].question_file +'</td><td>'+ questions[i].question_label +'</td>';
	}
}

}



function finish() {
	if (initial_data.project_questions == 0) {
		
		previewForm();
		let preview = document.getElementById('preview');
		preview.classList.remove('hide');
		return;
	}
	let last_question_form = document.getElementById('question_form_' + initial_data.project_questions);
		if (last_question_form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			saveQuestion(initial_data.project_questions);
			previewForm();
			last_question_form.classList.add('hide');
		
			let question_tab = document.getElementById('tab_question_' + initial_data.project_questions);
			question_tab.classList.add('disabled');
			question_tab.classList.remove('active');
		
			let preview = document.getElementById('preview');
			preview.classList.remove('hide');
		}
		last_question_form.classList.add('was-validated');
}





function updateDTMFStatus(event, dtmf_num, question) {
	let el = event.target;

	let form_container = document.createElement('div');
	form_container.classList.add('hide');
	form_container.innerHTML = '<div class="form-group"><input type="text" id="dtmf_text_'+ question +'_' + dtmf_num + '" class="form-control" required><div class="invalid-feedback">Required field.</div></div>'
	
	el.parentNode.parentNode.parentNode.parentNode.append(form_container);

	// if this is not the last question OR skip logic is on, include select in dtmfs
	if (question != initial_data.project_questions && initial_data.is_linear == true) {
		form_container.innerHTML += '<div class="form-group"><select name="" id="dtmf_select_'+ question +'_' + dtmf_num + '" class="form-control" required></select><div class="invalid-feedback">Required field.</div></div>';

		let dtmf_select = document.getElementById('dtmf_select_'+ question +'_' + dtmf_num);

		for (let i=0; i < initial_data.project_questions; i++) {
			if ((i+1) == (question +1)) {
				dtmf_select.innerHTML += '<option value="question_' + (i+1) + '" selected>Go to Question ' + (i+1) + '</option>';
			} else {
				dtmf_select.innerHTML += '<option value="question_' + (i+1) + '">Go to Question ' + (i+1) + '</option>';
			}
		}
	}

	// if checked, show the form
	if(el.checked) {
		form_container.classList.remove('hide');
	} else {
		form_container.classList.add('hide');
	}
}

function trunkToggle() {
	let trunkCheck = document.getElementById('trunk_toggle');
	let trunkSelect = document.getElementById('trunk');
	let single_trunk_channels_cont = document.getElementById('single_trunk_channels_cont');
	let multi_channels_cont = document.getElementById('multi_channels');
	if (trunkCheck.checked == true) {
		trunkSelect.multiple = true;
		trunkSelect.classList.add('multi-select');
		
		single_trunk_channels_cont.classList.add('hide');
		single_trunk_channels_cont.classList.remove('show');

		let label = document.createElement('label');
		label.classList.add('channels_label');
		label.innerText = 'Total Channels: ';
		let span = document.createElement('span');
		span.setAttribute('id', 'total_channels_display');
		span.innerText = '0';
		label.append(span);
		multi_channels_cont.append(label);

		// deselect every option
		let options = document.querySelectorAll('#trunk option');
		console.log(options);
		for(i=0; i < options.length; i++) {
			options[i].selected = false;
		}

		initial_data.trunk_id = 'Multiple';

	} else {
		trunkSelect.multiple = false;
		trunkSelect.classList.remove('multi-select');
		let multi_channels_cont = document.getElementById('multi_channels');

		// remove content generated during multiselection
		multi_channels_cont.innerHTML = '';

		single_trunk_channels_cont.classList.add('show');
		single_trunk_channels_cont.classList.remove('hide');
	}
}


function trunkOptionToggle(event) {
	event.preventDefault();
	if(event.target.selected == true) {
		//delete the corresponding channel slider
		let channelsContainer = document.getElementById('channels_cont' + parseInt(event.target.value));
		channelsContainer.parentNode.removeChild(channelsContainer);
		event.target.selected = false;

		updateTotalChannels();
		// remove from trunk 
		if (initial_data.multi_trunk.length > 0) {
			for (i=0; i < initial_data.multi_trunk.length; i++) {
				if (initial_data.multi_trunk[i].trunk_id == event.target.value) {
					initial_data.multi_trunk.splice(i, 1);
				}
			}
		}
	} else {
		event.target.selected = true;
		// add to trunk list
		let multi_trunk_item = {
			'trunk_id': event.target.value,
			'channels': null
		}
		initial_data.multi_trunk.push(multi_trunk_item);
		let multi_channels_cont = document.getElementById('multi_channels');

		let new_channels_slider_cont = document.createElement('div');
		new_channels_slider_cont.setAttribute('id', 'channels_cont'+ parseInt(event.target.value));
		new_channels_slider_cont.classList.add('form-group');

		let label = document.createElement('label');
		label.classList.add('channels_label');

		new_channels_slider_cont.innerHTML = '<label for="formControlRange" class="channels-label">Trunk '+ event.target.value + ' | Channels: '+
		'<i onclick="updateMultiChannelsValue(\'minus\',' + parseInt(event.target.value) +')" id="channelsMinus" class="fas fa-minus"></i>'+
		'<span id="channelsDisplay_'+ parseInt(event.target.value) +'">1</span>'+
		'<i onclick="updateMultiChannelsValue(\'plus\', '+ parseInt(event.target.value) +')" id="channelsPlus" class="fas fa-plus"></i>'+
		'</label><input type="range" class="form-control-range" id="channels'+ parseInt(event.target.value) +'" min="1" max="100" value="1" '+
		'onchange="updateTotalChannels()" onclick="setChannelsMulti(event, '+ parseInt(event.target.value) +'); updateTotalChannels();" onmousemove="setChannelsMulti(event, '+ parseInt(event.target.value) +')">'
		multi_channels_cont.append(new_channels_slider_cont);

		let channelsRangeInput = document.getElementById('channels' + parseInt(event.target.value));
		channelsRangeInput.setAttribute('max', parseInt(event.target.value));
		channelsRangeInput.value = parseInt(event.target.value);
		document.getElementById('channelsDisplay_'+ parseInt(event.target.value)).innerText = event.target.value;
		updateTotalChannels();
	}
}

function setChannelsMulti(event, trunkid) {
	let channelsRangeInput = document.getElementById('channels' + trunkid);
	channelsRangeInput.trunkid = trunkid;

	document.getElementById('channelsDisplay_'+ trunkid).innerText = event.target.value;
}

function updateMultiChannelsValue(op, trunkid) {
	let channelsRangeInput = document.getElementById('channels' + trunkid);
	if (op == 'plus') {
		channelsRangeInput.value = parseInt(channelsRangeInput.value) + 1;
	} else if (op == 'minus') {
		channelsRangeInput.value -= 1;
	}
	document.getElementById('channelsDisplay_' + trunkid).innerText = channelsRangeInput.value;

 updateTotalChannels();

}	


function updateTotalChannels() {
	let total_channels_display = document.getElementById('total_channels_display');
	let total_value = 0;
	let channels_display_all = document.querySelectorAll('span[id^="channelsDisplay_"]');

	for (i=0; i < channels_display_all.length; i++) {
		let el = document.getElementById(channels_display_all[i].id);
		total_value += Number(el.innerText);
	}
	total_channels_display.innerText = total_value.toString();
	initial_data.project_channels = total_value;
}

function validateQuestionLabel(event) {
	let input = event.target;
	let value = input.value;

	// check all question labels and mark as invalid if the label is already in use
	if (questions.length > 0) {
		for (i=0; i < questions.length; i++) {
			if (questions[i].question_label.toUpperCase() == value.toUpperCase()) {
				input.setCustomValidity("Question label must be unique.");
				return;
			}
		}
		input.setCustomValidity("");
	}
}