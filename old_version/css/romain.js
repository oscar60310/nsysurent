var choose;
var items = "4040討論室,4019系倉/辦公室";
var day;

function load()
{
	
	check_user();
	var now = new Date();
	var select = document.getElementById("illu");
	
	$(function(){
    	$("#picker").datepicker({
    		onSelect: function () 
    		{
         		searchi(select.value);
       		},
    		dateFormat : 'yy/mm/dd',
    		defaultDate: now
    	});
	});

  
	choose = [];
	day = [];
	loadDate(now);
	var item = items.split(',');

	for(var i = 0 ; i< item.length ;i++)
	{
		var td = document.createElement("OPTION");
		td.innerHTML = item[i];
		select.appendChild(td);
	}
	select.value = "請選擇";
	select.onchange = function(){
		searchi(select.value);
	};

	console.log("javascript loaded.");
}
function searchi(item)
{
	$("#show").html("<i class='fa fa-circle-o-notch fa-spin'></i> 正在查詢借用狀況");
	$('#illu').attr('disabled', 'disabled');

	choose = [];
	$("#have_choose").html(choose.length);
	var check = new XMLHttpRequest();
	check.onreadystatechange = function() { 
       	if (check.readyState == 4 && check.status == 200)
        	{
        		update_cal(check.responseText);
        		$("#show").html("");
				$('#illu').removeAttr('disabled');
        	}
        	
    };
    check.open("GET", '../api/ro?ac=check&item=' + item); // true for asynchronous 
    check.send(null);
}
var user = '';
function update_cal(s)
{
	var now = new Date();
	now.setTime($("#picker").datepicker("getDate").getTime());
	console.log(now);
	choose = [];
	day = [];	
	loadDate(now);

	detial = s.split(',');
	
	for(var i=0;i<detial.length-1;i++)
	{
		for(var j = 0 ;j<day.length;j++)
		{
			if(day[j]==detial[i].split('^')[1])
			{
				if( detial[i].split('^')[4] == "1")
				{
				
					$("#show_d"+j+"t"+detial[i].split('^')[2]).html(user);
				}
				else
				{
					$("#show_d"+j+"t"+detial[i].split('^')[2]).html("<a href='https://www.facebook.com/" + detial[i].split('^')[3] + "' target='_blank'>" + detial[i].split('^')[0] +"</a>");
				}
				$("#show_d"+j+"t"+detial[i].split('^')[2]).addClass('has_rent').removeClass('statu');
				break;
			}
		}
	}
}
function loadDate(start)
{

	
	$("#table_c").html("<tr id='date_show'><th class='time_label'>日期</th></tr>");
	var now = start;
	for(var i = 0 ; i < calNumdate() ;i++)
	{

		var label = document.getElementById("date_show");
	
		var td = document.createElement("TD");
		td.className = "date_label";
		var s = now.getFullYear() + "/";
		if((now.getMonth()+1)>=10)
			s += (now.getMonth()+1) + "/";
		else
			s += "0"+(now.getMonth()+1) + "/";

		if(now.getDate()>=10)
			s += now.getDate();
		else
			s += "0"+now.getDate();

		day.push(s);
		td.innerHTML =  now.getFullYear() + "/" + (now.getMonth() + 1)+ "/" + now.getDate() 
		+ "<br>" + week(now.getDay());
		label.appendChild(td);

		now.setTime(now.getTime() + 1000*60*60*24*1 );
	}
	console.log(day);
	$("#picker").val(day[0]);
	for(var i = 8 ; i < 24 ; i++)
	{
		var label = document.getElementById("table_c");
		var td = document.createElement("TR");
		td.className = "time_label";
		td.innerHTML = "<td>"+ i + ":00<br>" + (i+1) + ":00</td>";
		for(var j = 0 ; j <calNumdate() ;j++)
		{
			var td2 = document.createElement("TD");
			td2.id = "show_d"+j+"t"+i;
			td2.className = "statu";
			clickdata(td2,j,i);
	

			td.appendChild(td2);

		}
		label.appendChild(td);
	}
}
function clickdata(obj,date,time)
{
	obj.addEventListener('click', function() {
		if($(obj).hasClass('has_rent'))
		{
			if($(obj).html() == user)
			{
			var r = confirm("確定刪除"+ day[date] + "\n" + time + "點-" + (time+1) + "點的資料嗎?");
			if(r)
			{
				var de = new XMLHttpRequest();
				de.onreadystatechange = function() { 
       			if (de.readyState == 4 && de.status == 200)
        		{
        			if(de.responseText=="OK");
        			{
        				$(obj).removeClass('has_rent').html("");
        				alert("刪除完成");
        			}
        		}
        	
        	
       		 	};
    			de.open("GET", '../api/ro?ac=del&date=' + day[date] + '&item=' + $("#illu").val()+"&time="+time); // true for asynchronous 
    			de.send(null);
			}
			}
			else
			{
				console.log($(obj).html() +"-"+user);
			}
			return;
			
		}
		var chosed = false;
		var position;
		for(var i = 0 ;i<choose.length;i++)
		{
			if(date == choose[i].date && time == choose[i].time)
			{
				position = i;
				chosed = true;
				break;
			}
		}
		if(!chosed)
		{
			$(obj).addClass("state_choose");
			$(obj).html(time+"點 - "+(time+1)+"點");
			var new_chose = {date:date,time:time};
			choose.push(new_chose);
		}
		else
		{
			$(obj).removeClass("state_choose");
			$(obj).html("");
			choose.splice(i,1);
		}
	   	$("#have_choose").html(choose.length);

	}, false);
}
function submit()
{

	
	if(choose.length == 0)
	{
		alert("請選擇借用時段");
		return;
	}
	else if($("#illu").val()=="請選擇")
	{
		alert("請選擇場地");
		return;
	}
	else if(user=="")
	{
		alert("請先登入");
		return;
	}
	else
	{
		var r = confirm("確定借用"+$("#illu").val()+"?");
		if(!r)
			return;
		var s = "ac=rent&usr=" + $("#usr").val() + "&item=" + $("#illu").val() +"&date=";
		for(var i=0;i<choose.length;i++)
		{
			s+= day[choose[i].date] + "-" + choose[i].time +",";
		} 
	
		var order = new XMLHttpRequest();
		order.onreadystatechange = function() { 
       		if (order.readyState == 4 && order.status == 200)
        	{
        		if(order.responseText=="OK");
        		{
        			alert("借用完成");
        			window.location="";
        		}
        	}
        	
        };
    	order.open("GET", '../api/ro?' + s); // true for asynchronous 
    	order.send(null);
		
	}
}
function week(w)
{

	var weekday = new Array(7);
	weekday[0]=  "星期日";
	weekday[1] = "星期一";
	weekday[2] = "星期二";
	weekday[3] = "星期三";
	weekday[4] = "星期四";
	weekday[5] = "星期五";
	weekday[6] = "星期六";

	return weekday[w];

}
function calNumdate()
{
	/*var emSize = parseFloat($("body").css("font-size"));
    var wid = $( window ).width() / emSize;
    wid -= 3 ; //For 日期 text
    var canput = Math.floor(wid/10);
    if (canput > 7)
    	canput = 7;
    return canput; */
    return 7;
   
}
function check_user()
{
	var login = new XMLHttpRequest();
	login.onreadystatechange = function() { 
    	if (login.readyState == 4 && login.status == 200)
    	{
    		console.log(login.responseText);
      	  	if(login.responseText!="None")
        	{
        		$("#sub_btn").removeClass("disabled");
        		$("#usr").html(login.responseText);
        		user = login.responseText
       		}
       		else
       		{
       			$("#usr").html("尚未登入");
     	  	}	
        	
	    }
	}
    login.open("GET", '../api/login?ac=check'); // true for asynchronous 
    login.send(null);
}