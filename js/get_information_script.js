$(document).ready(function() {


	$.ajax({
		type: "POST",
		url: "/wp-content/themes/sds/assets/get_project_status.php",
		dataType: "json",
		success: function(data)
		{
			$(".projects").append(data);
			//alert(data);
		}
	});

	$.ajax({
		type: "POST",
		data: {
			Type: "main",
			sdsId: localStorage.getItem('sds_id')
		},
		url: "/wp-content/themes/sds/assets/get_data_charts.php",
		dataType: "json",
		success: function(data)
		{
			var dates = [];
			for (var i = data.length-1; i >= 0; i--) {
				var t = data[i]['this_date'].split(/[- :]/);
				var date = t[2] + '.' + t[1];
				dates.push(date);
			};

			//автоматическое формарование таблиц (даты)
			var var_labels = [];
			for (var y = 0; y <= data.length - 1; y++) {
				var_labels[y] = dates[y];
			};
			var_labels.reverse();

			//автоматическое формарование таблиц 
			var var_eff = [];
			var var_eff_depth = [];
			var var_assets = [];
			var var_daily = [];
			var var_waste = [];
			var var_current = [];
			var var_health = [];
			var var_sleep = [];
			for (var x = 0; x <= data.length - 1; x++) {
				var_eff[x] = data[x]['efficiency'];
				var_eff_depth[x] = data[x]['efficiency_depth_percent'];
				var_assets[x] = data[x]['time_assets'];
				var_daily[x] = data[x]['time_daily'];
				var_waste[x] = data[x]['time_waste'];
				var_current[x] = data[x]['time_current'];
				var_health[x] = data[x]['time_health'];
				var_sleep[x] = data[x]['time_sleep']
			};

			//console.log(var_labels);
			//console.log(var_eff);

			var chart1 = {
			  labels: var_labels,
			  series: [
			    	var_assets,
			    	var_daily,
			    	var_waste,
			    	var_current
			    ]
			};

			var chart2 = {
			  labels: var_labels,	  
			  series: [
			    var_eff
			   	 ]
			};

			var chart20 = {
			  labels: var_labels,	  
			  series: [
			    var_eff_depth
			   	 ]
			};

			var chart3 = {
			  labels: var_labels,
			  series: [
			    	var_sleep
			    ]
			};

			var chart_options1 = {
			  showPoint: true,
			  lineSmooth: true,
			  axisX: {
			  showGrid: true,
			  showLabel: true
			  },
			  axisY: {
			    offset: 50,
			    labelInterpolationFnc: function(value) {
			      return  value + ' m';
			    }
			  }
			};

			var chart_options2 = {
			  showPoint: true,
			  lineSmooth: true,
			  axisX: {
			  showGrid: true,
			  showLabel: true
			  },
			  axisY: {
			    offset: 50,
			    labelInterpolationFnc: function(value) {
			      return  value + ' %';
			    }
			  }
			};

			var chart_options20 = {
			  showPoint: true,
			  lineSmooth: true,
			  axisX: {
			  showGrid: true,
			  showLabel: true
			  },
			  axisY: {
			    offset: 50,
			    labelInterpolationFnc: function(value) {
			      return  value + ' %';
			    }
			  }
			};

			var chart_options3 = {
			  showPoint: true,
			  lineSmooth: true,
			  axisX: {
			  showGrid: true,
			  showLabel: true
			  },
			  axisY: {
			    offset: 50,
			    labelInterpolationFnc: function(value) {
			      return  value + ' m';
			    }
			  }
			};

			new Chartist.Line('#chart1', chart1, chart_options1);
			new Chartist.Line('#chart20', chart20, chart_options20);
			new Chartist.Line('#chart2', chart2, chart_options2);
			new Chartist.Line('#chart3', chart3, chart_options3);
		}
	});

	$.ajax({
		type: "POST",
		data: {
			Type: "week_comprsn",
			sdsId: localStorage.getItem('sds_id')
		},
		url: "/wp-content/themes/sds/assets/get_data_charts.php",
		dataType: "json",
		success: function(data)
		{
			//console.log(data);
			var weeks = [];
			for (var i = 0; i <= data.length-1; i++) {
				var t = data[i]['this_date'].split(/[- :]/);
				var date = 'Week ' + t[2] + '.' + t[1];
				weeks.push(date);
			};

			//автоматическое формарование таблиц (даты)
			var var_weeks = [];
			for (var q = 0; q <= data.length - 1; q++) {
				var_weeks[q] = weeks[q];
			};
			//var_weeks.reverse();

			//автоматическое формарование таблиц 
			var var_av_eff = [];
			for (var s = 0; s <= data.length - 1; s++) {
				var_av_eff[s] = data[s]['av_efficiency'];
			};

			var chart4 = {
			  // A labels array that can contain any sort of values
			  labels: var_weeks,
			  // Our series array that contains series objects or in this case series data arrays
			  series: [
			    	var_av_eff
			    ]
			};

			var chart_options4 = {
			  showPoint: true,
			  lineSmooth: true,
			  axisX: {
			  showGrid: true,
			  showLabel: true
			  },
			  axisY: {
			    offset: 50,
			    labelInterpolationFnc: function(value) {
			      return  value + ' %';
			    }
			  }
			};

			new Chartist.Line('#chart4', chart4, chart_options4);
			
		}
	});

});