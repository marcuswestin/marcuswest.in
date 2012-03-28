<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	"http://www.w3.org/TR/html4/loose.dtd">

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Miss Manners</title>
	<!-- Date: 2007-12-20 -->

	<!-- Libraries -->
	<link rel="stylesheet" type="text/css" href="lib/farbtastic/farbtastic.css" />

	<!-- Source -->
	<link rel="stylesheet" type="text/css" href="css/layout.css" />
	<link rel="stylesheet" type="text/css" href="css/widgets.css" />
</head>
<body>
	<center>
		<div id="header">
			<img id="logo" src="img/logo.jpg" />
			<span id="slogan">MISS MANNERS: <span class="xxsmall">"Seat Your Guests Properly"</span></span>
		</div>
		<div id="body-layout">
			<table><tbody><tr>
				<td id="panel">
					<!-- The guest add controller -->
					<div id="controller">
						<!-- First row: name and gender -->
						<input type="text" id="guestName" />
						<input type="image" src="img/female.png" alt="Female" id="femaleSelector" value="female" />
						<input type="image" src="img/male.png" alt="Male" id="maleSelector" value="male" />

						<!-- Second row: interests, color and add -->
						<input type="text" id="guestInterest" />
						<div id="guestColor" >&nbsp;</div>
						<input type="image" id="guestAdd" src="img/add.png" alt="Add guest" />
						<div id="colorPicker"></div>
					</div>


					<!-- The running guest list -->
					<div id="guestList">

					</div>
				</td>
				<td id="bodySpacing"> </td>
				<td id="body">
					<!-- Hide the explanation until they ask for it -->
					<input class="button right" type="button" value="What's So Special?" id="explanationButton">
					<div id="explanation" class="hidden">
						<h1>What's So Special?</h1>
						<h2>First of all</h2>
						<p>The interface is all ajaxie and neat. Props to the <a href="http://ejohn.org/">John Resig</a> 
							and <a href="http://docs.jquery.com/About/Contributors">the Team</a> 
							at <a href="http://jquery.com">jQuery</a> for the sturdy framework - it makes development joyful.
						</p>
						<h2>More importantly</h2>
						<p>The back end is driven by a state of the art rule 
							and <a href="http://en.wikipedia.org/wiki/Business_rules_engine">process engine</a>. 
							Being possibly the first software architecture to integrate a rule engine with a process engine,
							we may be breaking some seriously new ground
						</p>
						<h2>The code</h2>
						<p>Miss Manners, a frequent sample problem, can be summarized in our scripting language as follows:</p>
							<pre><code>
member(X,[X|_]) --> true; 
member(X,[_|L]) --> member(X,L); 

answer(A) --> seating_list(1,[_],A); 

seating_list(N,L0,L) : last_seat(N) --> L=L0; 
seating_list(N1,L0,L) --> 
L0 = [Name1|_] 
and guest(Name1,Sex1,Hobby) 
and guest(Name2,Sex2,Hobby) 
and not Name1=Name2 
and not Sex1=Sex2 
and not member(Name2,L0) 
and eval(N1+1,N2)  
and seating_list(N2,[Name2|L0],L); 
							</code></pre>
							<p>Rather straight forward, as you can see - after groking some syntax the tools are very powerful. 
								We are also developing a graphical user interface for rule and process editing for laymen users. 
								What this will allow for, we can only wait and see.</p> 
						</div>

						<input class="button" type="button" value="Sample Data" id="sampleData">
						<br />
						<input class="button" type="button" value="Place Guests" id="placementButton">
						<div id="placement">
							<img src="img/table.png" id="table" />
						</div>
					</td>
				</tr></tbody></table>
			</div>
			<div id="footer">

			</div>
		</center>
		<?php
			$ROOT = $_SERVER['DOCUMENT_ROOT']."/../"; 
			include "${ROOT}include/macros.php";
		?>	
		<?printTracker("UA-1101899-13");?>
	</body>
	<!-- Libraries -->
	<script type="text/javascript" src="lib/jquery.js"></script>
	<script type="text/javascript" src="lib/farbtastic/farbtastic.js"></script>
	<!-- Source -->
	<script type="text/javascript" src="js/mwd.js"></script>
	<script type="text/javascript" src="js/MissManners.js"></script>
	<script type="text/javascript" src="js/application.js"></script>
	</html>