<?php

# generic information
$job = array();
$job['id'] = uniqid();
$job['ods_filename'] = "doc-{$job['id']}.ods";
$job['pdf_filename'] = "doc-{$job['id']}.pdf";

# paths for the web. All other is private
$web = array();
$web['id'] = uniqid();
$web['dir'] = "jobs/{$job['id']}/";
$web['json'] = $web['dir']."args.json";
$web['log'] = $web['dir']."log.txt";
$web['ods'] = $web['dir'].$job['ods_filename'];
$web['pdf'] = $web['dir'].$job['pdf_filename'];

# local configuration containing absolute paths
$local = array();
$local['job_basedir'] = realpath('./jobs');
$local['ods_file'] = realpath('./Stundenzettel-vorlage.ods');
$local['working_dir'] = 'working';

# user given data
$arg = $_GET;

# make some quick checks
if(!$local['ods_file'])
	die("Bad ODS input file given");

# all data to be json encoded for the job
$data = compact('arg', 'job', 'web', 'local');

# to be sent back to the client
$pub = compact('job', 'web', 'arg');

function ret($data) {
	print json_encode($data, 128 /* pretty print php 5.3 */);
	exit;
}

# fill in all the data recieved by POST
$encode = json_encode($data, 128 /* pretty print php 5.3 */);

if(strlen($encode) > 20*1000)
	# this is way too much data, guys
	die("Caught! This is not real data");


# create jobdir
if(!file_exists($web['dir'])) {
	mkdir($web['dir']);
} else {
	ret(array('msg'=>'Jobdir exists', 'jobdir'=>$web['dir']));
}

file_put_contents($web['json'], $encode);

# run the creation in background
$descriptorspec = array(
   array('pipe', 'r'),               // stdin
   array('file', $web['log'], 'a'),  // stdout
   array('pipe', $web['log'], 'a'),  // stderr
);

# this proc_open forks and immediately returns
$abs_jobdir = escapeshellarg(realpath($web['dir']));
$proc = proc_open("python ../job_interface/run-job.py --job_directory $abs_jobdir &", $descriptorspec, $pipes);


ret($pub);
/*

$computers = array('bishop', 'iceman', 'jubilee', 'storm', 'wolverine', 'xavier');
$rkey = array_rand($computers); # does not need to be super-duper
$computer = $computers[$rkey];
$pwd = dirname(__FILE__);

echo "Running on $computer\n";

$cmd = "ssh $computer '$pwd/libreoffice-driver/run.py $jobid'";

echo `$cmd 2>&1; echo $?`;

*/
