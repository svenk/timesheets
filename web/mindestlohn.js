var mindestlohn = {};
mindestlohn.spinnertpl = '<i class="fa fa-spinner fa-spin"></i>';
mindestlohn.odsicon = '<i class="fa fa-file-text-o"></i>';
mindestlohn.pdficon = '<i class="fa fa-file-pdf-o"></i>';
mindestlohn.clientId = 0;

$(function(){
	$("form.job-submission").submit(function(){
		formData = $(this).serialize(); // a=b&c=d&...
		//formData += "&clientId="+(++mindestlohn.clientId);
		$.getJSON(this.action, formData, mindestlohn.recieveId);
		
		//intermediateData = { 'state': 'submitting' };
		//intermediateData.job = {'intermediate':true, id: mindestlohn.clientId };
		//mindestlohn.render(intermediateData);
		mindestlohn.submit_start();
		return false;
	});


	$.get('entry.twig', function(tpl) {
		mindestlohn.template = tpl;
	});
});

mindestlohn.submit_start = function() {
	$("form.job-submission button[type=submit]").attr("disabled", true)
		.find("i").removeClass("hide");
}

mindestlohn.submit_stop = function() {
	$("form.job-submission button[type=submit]").attr("disabled", false)
		.find("i").addClass("hide");	
}

mindestlohn.error = function(txt) {
	$("#results").append('<div class="alert alert-danger">'+txt+'</div>');
}

mindestlohn.getId = function(data) {
	if(data.job && data.job.id) {
		var id = 'job-'+data.job.id;
		return id;
	}
	return false;
};

mindestlohn.$getId = function(data) {
	var id = mindestlohn.getId(data);
	return id ? $("#"+id) : $();
}

mindestlohn.render = function(tpl_data) {
	if(!mindestlohn.template)
		return mindestlohn.error("Template not yet loaded.");

	var html = swig.render(mindestlohn.template, { filename: '/tpl', locals: { data: tpl_data }});

	var $id = mindestlohn.$getId(tpl_data);
	if($id.length)
		$id.replaceWith(html);
	else
		$("#results").append(html);

	mindestlohn.updateStates(tpl_data);
};

mindestlohn.updateStates = function(data, state) {
	DotState = "."+state;
	if(state) {
		// modify data
		data.state = state;
	}

	// store previous states
	if(data.prev_states)
		data.prev_states.push(state);
	else	data.prev_states = [state];

	var $id = mindestlohn.$getId(data);

	$states = $id.find(".state");
	$states.hide();

	data.prev_states_filter += data.prev_states.map(function(x){ return "."+x; }).join(", ");
	$states.filter(".after").filter(data.prev_states_filter).not(DotState).show();

	if(!data.state)
		data.state = "missing-state";

	$states.filter(DotState).show();
};

mindestlohn.recieveId = function(data) {
	mindestlohn.submit_stop();

	if(!data.job) {
		if(!data.msg)
			data.msg = "Strange error, bad submission data";

		mindestlohn.updateStates(data, 'error');
	} else {
		// this was lost during... yes.
		mindestlohn.updateStates(data, 'submitted');
	}

	mindestlohn.render(data);

	if(data.job)
		mindestlohn.poll(data);
};

mindestlohn.pollTimeout = 250; /* ms */

mindestlohn.poll = function(data) {
	console.log("Polling with ", data);

	dot = document.createTextNode('.');
	switch(data.state) {
		default:
		case 'ready-for-poll':
		case 'wait-for-ods':
			mindestlohn.updateStates(data, 'wait-for-ods');
			//$tr.find('td.ods').append(dot);
			poll_url = data.web.ods;
			success_next = 'finished-ods';
			break;
		case 'finished-ods':
			mindestlohn.updateStates(data, 'finished-ods');
			//$tr.find('td.ods').html("<a href='"+arg.job.ods+"'>"+mindestlohn.odsicon+" "+basename(arg.job.ods)+"</a>");
			/* no break, instead continue */
		case 'wait-for-pdf':
			mindestlohn.updateStates(data, 'wait-for-pdf');
			//$tr.find('td.pdf').append(dot);
			poll_url = data.web.pdf;
			success_next = 'finished-pdf';
			break;
		case 'finished-pdf':
		case 'done':
			mindestlohn.updateStates(data, 'finished-pdf');
			data.finishPoll = true;
			break;
	}

	console.log("Polling, current state is ", data.state);

	if(!data.finishPoll)
		$.ajax({
			type: 'HEAD',
			async: true,
			url: poll_url,
		}).done(function(){
			console.log("Success with", data);
			data.state = success_next;
			mindestlohn.poll(data);
		}).fail(function() {
			setTimeout(function(){ mindestlohn.poll(data); }, mindestlohn.pollTimeout);
		});
};

// helper function
function basename(path) {
   return path.split('/').reverse()[0];
}

