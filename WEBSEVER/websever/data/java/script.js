/*=======================================================================*/
/*Header*/
/*=======================================================================*/

/*<!-- Menu item -->*/
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".header__menu-iteam-stop");
  const notifyItems = document.querySelectorAll(".header__notify-item");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const itemInfo = button.closest(".header__menu-iteam-info");
      const stateSpan = itemInfo.querySelector(".header__menu-iteam-state");
      const stateIcon = itemInfo.querySelector(".header__menu-iteam-icon-state");
      const programName = itemInfo.querySelector(".header__menu-iteam-name").textContent;

      if (stateSpan.textContent === "Active") {
        setTimeout(function () {
          stateSpan.textContent = "Inactive";
          stateSpan.style.color = "#949494";
          stateIcon.style.color = "#949494";
          button.textContent = "Start";
          // Update notification status
          notifyItems.forEach(function (item) {
            const notifyName = item.querySelector(".header__notify-name").textContent;
            if (notifyName === programName) {
              item.querySelector(".header__notify-description").textContent = "Inactive";
            }
          });
        }, 0);
      } else {
        setTimeout(function () {
          stateSpan.textContent = "Active";
          stateSpan.style.color = "#4e8bf4";
          stateIcon.style.color = "green";
          button.textContent = "Stop";
          // Update notification status
          notifyItems.forEach(function (item) {
            const notifyName = item.querySelector(".header__notify-name").textContent;
            if (notifyName === programName) {
              item.querySelector(".header__notify-description").textContent = "Active";
            }
          });
        }, 0);
      }
    });
  });
});

/* Check Program */
/* Check Program */
document.addEventListener("DOMContentLoaded", function () {
  // Lưu trạng thái chương trình đã chọn
  var selectedProgramIndex = null;

  // Lưu các phần tử thẻ a chương trình
  var programLinks = document.querySelectorAll(".header__menu-iteam");

  // Lưu nút Check program
  var checkButton = document.querySelector(".header__menu-view-menu");

  // Lưu các phần tử thẻ a của category
  const buttonsCategory = document.querySelectorAll(".category-item__link");

  // Hàm thay đổi background và màu chữ khi click vào chương trình
  function changeBackgroundAndTextColor(event) {
    // Lấy chỉ mục của chương trình được click
    var clickedProgramIndex = Array.from(programLinks).indexOf(event.target.closest(".header__menu-iteam"));

    // Kiểm tra xem phần tử được click có chứa nút "STOP" hoặc "START" không
    var isStopStartButton = event.target.classList.contains("header__menu-iteam-stop");

    // Kiểm tra nếu không phải là nút "STOP" hoặc "START"
    if (!isStopStartButton) {
      // Kiểm tra nếu chương trình hiện tại đã được chọn
      if (clickedProgramIndex === selectedProgramIndex) {
        // Hủy chọn chương trình
        programLinks[clickedProgramIndex].style.background = "";
        selectedProgramIndex = null;
      } else {
        // Hủy chọn chương trình hiện tại nếu có
        if (selectedProgramIndex !== null) {
          programLinks[selectedProgramIndex].style.background = "";
        }
        // Chọn chương trình mới
        programLinks[clickedProgramIndex].style.background = "linear-gradient(0, #42d3ec, #fff)";
        selectedProgramIndex = clickedProgramIndex;
      }
    }
  }

  // Gán sự kiện click cho từng chương trình
  programLinks.forEach(function (link) {
    link.addEventListener("click", changeBackgroundAndTextColor);
  });

  // Hàm xử lý khi click vào nút Check program
  function checkProgram() {
    // Kiểm tra nếu có chương trình được chọn
    if (selectedProgramIndex !== null) {
      // Điều hướng đến chương trình đó
      window.location.href = "#" + (selectedProgramIndex + 1);
      // Đồng bộ màu chữ trong category sau khi kiểm tra chương trình
      buttonsCategory.forEach(function (btn) {
        btn.style.color = "";
      });
      buttonsCategory[selectedProgramIndex].style.color = "#4e8bf4";
      // Cập nhật số trang dựa trên chương trình đã chọn
      var currentPage = selectedProgramIndex + 1;
      updatePageNumber(currentPage);
    } else {
      // Hiển thị thông báo nếu không có chương trình nào được chọn
      alert("Vui lòng chọn một chương trình trước khi kiểm tra!");
    }
  }

  // Gán sự kiện click cho nút Check program
  checkButton.addEventListener("click", checkProgram);

  // Đặt màu xanh cho chương trình mặc định (Program 1) trong category
  // buttonsCategory[0].style.color = "#4e8bf4";

  // Gán sự kiện click cho từng chương trình trong category
  buttonsCategory.forEach(function (button, index) {
    button.addEventListener("click", function () {
      // Loại bỏ màu xanh khỏi tất cả các chương trình trong category
      buttonsCategory.forEach(function (btn) {
        btn.style.color = "";
      });
      // Đặt màu xanh cho chương trình được chọn trong category
      button.style.color = "#4e8bf4";
      // Đồng bộ màu nền và màu chữ khi click chương trình từ category
      programLinks[index].click();
      // Cập nhật số trang dựa trên chương trình đã chọn
      var currentPage = index + 1;
      updatePageNumber(currentPage);
    });
  });

  // Xử lý số trang
  const currentPageElement = document.querySelector(".home-filter__page-current");
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");
  const paginationItems = document.querySelectorAll(".pagination-item");
  const prevPageButtonPagination = document.querySelector(".pagination-item__icon-left");
  const nextPageButtonPagination = document.querySelector(".pagination-item__icon-right");

  let currentPage = parseInt(localStorage.getItem("currentPage")) || 1; // Sử dụng localStorage để lấy trang hiện tại, nếu không có thì mặc định là 1
  const maxPage = paginationItems.length - 2;

  updatePageNumber(currentPage);

  prevPageButton.addEventListener("click", () => currentPage > 1 && updatePage(-1));
  nextPageButton.addEventListener("click", () => currentPage < maxPage && updatePage(1));

  prevPageButtonPagination.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage > 1) updatePage(-1);
  });

  nextPageButtonPagination.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < maxPage) updatePage(1);
  });

  paginationItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      if (index !== 0 && index !== paginationItems.length - 1) {
        currentPage = index;
        updatePageNumber(currentPage);
        // Đồng bộ chương trình được chọn khi chuyển trang
        var selectedProgramIndex = currentPage - 1;
        buttonsCategory.forEach(function (btn, idx) {
          btn.style.color = idx === selectedProgramIndex ? "#4e8bf4" : "";
        });
      }
    });
  });

  function updatePage(delta) {
    currentPage += delta;
    updatePageNumber(currentPage);
    // Đồng bộ chương trình được chọn khi chuyển trang
    var selectedProgramIndex = currentPage - 1;
    buttonsCategory.forEach(function (btn, idx) {
      btn.style.color = idx === selectedProgramIndex ? "#4e8bf4" : "";
    });
    window.location.href = "index" + currentPage + ".html";
  }

  function updatePageNumber(currentPage) {
    currentPageElement.textContent = currentPage;
    currentPageElement.style.color = "blue"; // Đặt màu xanh cho số trang
    prevPageButton.classList.toggle("home-filter__page-btn--disabled", currentPage === 1);
    nextPageButton.classList.toggle("home-filter__page-btn--disabled", currentPage === maxPage);

    // Cập nhật địa chỉ href cho các thẻ <a> dựa trên trang hiện tại (xem xét)
    prevPageButton.href = currentPage > 1 ? `#${currentPage}` : "#1";
    nextPageButton.href = currentPage < maxPage ? `#${currentPage}` : `#${maxPage}`; // Cập nhật địa chỉ của trang cuối cùng

    // Lưu trang hiện tại vào localStorage
    localStorage.setItem("currentPage", currentPage.toString());

    paginationItems.forEach(function (item, index) {
      const isActive = index === currentPage;
      item.classList.toggle("pagination-item--active", isActive);
      item.querySelector(".pagination-item__link").classList.toggle("active", isActive);
    });
  }

  /* Value input X,Y,Z */
  const inputs = document.querySelectorAll('input[type="range"], input[type="number"]');
  const coordinates = {
    x: {
      input: document.getElementById('x-value'),
      slider: document.getElementById('x-position'),
      span: document.getElementById('x-coordinate')
    },
    y: {
      input: document.getElementById('y-value'),
      slider: document.getElementById('y-position'),
      span: document.getElementById('y-coordinate')
    },
    z: {
      input: document.getElementById('z-value'),
      slider: document.getElementById('z-position'),
      span: document.getElementById('z-coordinate')
    }
  };

  // Add 'input' and 'change' event listeners to each input
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      enforceMaxValue(this);
      updateCoordinatesFromInput(this);
    });
    input.addEventListener('change', function () {
      enforceMaxValue(this);
      updateCoordinatesFromInput(this);
    });
  });

  // Function to enforce max value on input change
  function enforceMaxValue(input) {
    let value = parseFloat(input.value);
    const max = parseFloat(input.max);

    if (value > max) {
      input.value = max;
    }
  }

  // Function to update coordinates from input (xem xét)
  function updateCoordinatesFromInput(input) {
    const id = input.id.replace('-value', '-position');
    let value = input.value;

    // If the input is empty, set the value to 0
    if (value === '') {
      value = 0;
    }

    const axis = id.charAt(0); // X, Y, or Z

    // Update the corresponding slider value
    coordinates[axis].slider.value = value;

    // Update coordinates display
    updateCoordinates();
  }

  // Function to update coordinates from slider
  function updateCoordinatesFromSlider(axis) {
    const value = coordinates[axis].slider.value;

    // Update the corresponding input value
    coordinates[axis].input.value = value;

    // Update coordinates display
    updateCoordinates();
  }

  // Function to update coordinates display
  function updateCoordinates() {
    for (let axis in coordinates) {
      let value = coordinates[axis].input.value;

      // If the input is empty, set the value to 0
      if (value === '') {
        value = 0;
      }

      coordinates[axis].span.textContent = `Tọa độ ${axis.toUpperCase()} là ${value}.`;
    }
  }

  // Add 'input' event listener to sliders
  if (coordinates != null){
    for (let axis in coordinates) {
      if (coordinates[axis].slider != null) {
        coordinates[axis].slider.addEventListener('input', function () {
          updateCoordinatesFromSlider(axis);
        });
      } 
    }
    if (document.getElementById("DrillButton") != null){
      document.getElementById("DrillButton").addEventListener("click", function () {
        this.classList.toggle("off");
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Gauge for torque
  var chartTorque = JSC.chart('chartDiv2', {
    title: {
      label: {
        text: 'Momen',
        style: {
          fontSize: 15,
          fontWeight: 'bold',
          color: '#4e8bf4'
        }
      },
      position: 'center',
      align: 'center'
    },
    debug: true,
    type: 'gauge',
    animation_duration: 1000,
    legend_visible: false,
    xAxis: { spacingPercentage: 0.25 },
    yAxis: {
      defaultTick: {
        padding: -5,
        label_style_fontSize: '14px'
      },
      line: {
        width: 9,
        color: 'smartPalette',
        breaks_gap: 0.06
      },
      scale_range: [0, 12]
    },
    palette: {
      pointValue: '{%value/12}',
      colors: ['LightBlue', 'RoyalBlue', 'DarkBlue']
    },
    defaultTooltip_enabled: false,
    defaultSeries: {
      angle: { sweep: 180 },
      shape: {
        innerSize: '70%',
        label: {
          text: '<span color="%color">{%sum:n1}</span><br/><span color="#4e8bf4" fontSize="20px" fontWeight="bold">N/m</span>',
          style_fontSize: '46px',
          verticalAlign: 'middle'
        }
      }
    },
    series: [{
      type: 'column roundcaps',
      points: [{ id: '1', x: 'torque', y: 0 }]
    }]
  });

  // Gauge for position
  var chartPosition = JSC.chart('chartDiv1', {
    title: {
      label: {
        text: 'Position',
        style: {
          fontSize: 15,
          fontWeight: 'bold',
          color: '#4e8bf4'
        }
      },
      position: 'center',
      align: 'center'
    },
    debug: true,
    type: 'gauge',
    animation_duration: 1000,
    legend_visible: false,
    xAxis: { spacingPercentage: 0.25 },
    yAxis: {
      defaultTick: {
        padding: -5,
        label_style_fontSize: '14px'
      },
      line: {
        width: 6,
        color: 'smartPalette',
        breaks_gap: 0.06
      },
      scale_range: [0, 320]
    },
    palette: {
      pointValue: '{%value/20}',
      colors: ['LightBlue', 'RoyalBlue', 'DarkBlue']
    },
    defaultTooltip_enabled: false,
    defaultSeries: {
      angle: { sweep: 180 },
      shape: {
        innerSize: '70%',
        label: {
          text: '<span color="%color">{%sum:n1}</span><br/><span color="#4e8bf4" fontSize="20px" fontWeight="bold">CM</span>',
          style_fontSize: '46px',
          verticalAlign: 'middle'
        }
      }
    },
    series: [{
      type: 'column roundcaps',
      points: [{ id: '1', x: 'distance', y: 0 }]
    }]
  });

  // Gauge for encoder
  var chartEncoder = JSC.chart('chartDiv3', {
    title: {
      label: {
        text: 'Speed',
        style: {
          fontSize: 15,
          fontWeight: 'bold',
          color: '#4e8bf4'
        }
      },
      position: 'center',
      align: 'center'
    },
    debug: true,
    type: 'gauge',
    animation_duration: 1000,
    legend_visible: false,
    xAxis: { spacingPercentage: 0.25 },
    yAxis: {
      defaultTick: {
        padding: -5,
        label_style_fontSize: '14px'
      },
      line: {
        width: 9,
        color: 'smartPalette',
        breaks_gap: 0.06
      },
      scale_range: [0, 200]
    },
    palette: {
      pointValue: '{%value/200}',
      colors: ['LightBlue', 'RoyalBlue', 'DarkBlue']
    },
    defaultTooltip_enabled: false,
    defaultSeries: {
      angle: { sweep: 180 },
      shape: {
        innerSize: '70%',
        label: {
          text: '<span color="%color">{%sum:n1}</span><br/><span color="#4e8bf4" fontSize="20px" fontWeight="bold">RPM</span>',
          style_fontSize: '46px',
          verticalAlign: 'middle'
        }
      }
    },
    series: [{
      type: 'column roundcaps',
      points: [{ id: '1', x: 'encoder', y: 0 }]
    }]
  });

  function requestData(url, chart, pointId) {
    fetch(url)
      .then(response => response.text()) // Change to text() to parse plain text
      .then(data => {
        chart.series(0).options({
          points: [{ id: pointId, x: pointId, y: parseFloat(data) }] // Convert string to float
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Gauge for power
  var chartPower = JSC.chart('chartDiv', {
    title: {
      label: {
        text: 'Power',
        style: {
          fontSize: 15,
          fontWeight: 'bold',
          color: '#4e8bf4'
        }
      },
      position: 'center',
      align: 'center'
    },
    debug: true,
    type: 'gauge',
    animation_duration: 1000,
    legend_visible: false,
    xAxis: { spacingPercentage: 0.25 },
    yAxis: {
      defaultTick: {
        padding: -5,
        label_style_fontSize: '14px'
      },
      line: {
        width: 9,
        color: 'smartPalette',
        breaks_gap: 0.06
      },
      scale_range: [0, 200]
    },
    palette: {
      pointValue: '{%value/200}',
      colors: ['LightBlue', 'RoyalBlue', 'DarkBlue']
    },
    defaultTooltip_enabled: false,
    defaultSeries: {
      angle: { sweep: 180 },
      shape: {
        innerSize: '70%',
        label: {
          text: '<span color="%color">{%sum:n1}</span><br/><span color="#4e8bf4" fontSize="20px" fontWeight="bold">W</span>',
          style_fontSize: '46px',
          verticalAlign: 'middle'
        }
      }
    },
    series: [{
      type: 'column roundcaps',
      points: [{ id: '1', x: 'power', y: 0 }]
    }]
  });

  // Set up intervals to fetch data
  setInterval(function () {
    requestData("/distance", chartPosition, 'distance');
  }, 300);

  setInterval(function () {
    requestData("/torque", chartTorque, 'torque');
  }, 300);

  setInterval(function () {
    requestData("/encoder", chartEncoder, 'encoder');
  }, 300);

  // setInterval(function () {
  //   requestData("/power", chartPower, 'power');
  // }, 300);

});



/*=======================================================================*/
/*Main Program*/
/*=======================================================================*/
/* Initialize charts */

document.addEventListener("DOMContentLoaded", function () {
  // Postion chart
  var chartD = new Highcharts.Chart({
    chart: { renderTo: 'chart-position' },
    title: { text: 'Position' },
    series: [{
      showInLegend: false,
      data: []
    }],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true }
      },
      series: { color: '#059e8a' } // Màu cho line
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { text: 'Position (cm)' }
    },
    credits: { enabled: false }
  });

  // Moment chart
  var chartT = new Highcharts.Chart({
    chart: { renderTo: 'chart-momen' },
    title: { text: 'Momen' },
    series: [{
      showInLegend: false,
      data: []
    }],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true }
      },
      series: { color: '#1E90FF' } // Màu cho line
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { text: 'Momen (N.m)' }
    },
    credits: { enabled: false }
  });


  // Power chart
  var chartP = new Highcharts.Chart({
    chart: { renderTo: 'chart-power' },
    title: { text: 'Power' },
    series: [{
      showInLegend: false,
      data: []
    }],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true }
      },
      series: { color: '#FF6347' } // Màu cho công suất
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { text: 'Power (W)' }
    },
    credits: { enabled: false }
  });

  // speed chart
  var chartE = new Highcharts.Chart({
    chart: { renderTo: 'chart-speed' },
    title: { text: 'Speed' },
    series: [{
      showInLegend: false,
      data: []
    }],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true }
      },
      series: { color: '#FF4500' } // Màu cho nhiệt độ
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { text: 'Speed (rpm)' }
    },
    credits: { enabled: false }
  });

  // Update intervals
  setInterval(function () {
    requestData("/distance", chartD);
  }, 300);
  setInterval(function () {
    requestData("/torque", chartT);
  }, 300);

  // setInterval(function () {
  //   requestData("/power", chartP);
  // }, 300);

  setInterval(function () {
    requestData("/encoder", chartE);
  }, 300);

  // Function to request data
  function requestData(endpoint, chart) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var x = (new Date()).getTime(),
        y = parseFloat(this.responseText);

        if (chart.series[0].data.length > 40) {
          chart.series[0].addPoint([x, y], true, true, true);
        } else {
          chart.series[0].addPoint([x, y], true, false, true);
        }
      }
    };
    xhttp.open("GET", endpoint, true);
    xhttp.send();
  }
});

/* Category */
document.addEventListener('DOMContentLoaded', function () {
  const mobileCategoryMenu = document.getElementById('mobile-category-menu');
  const gridColumn2 = document.querySelector('.grid__column-2');
  const gridColumn10 = document.querySelector('.grid__column-10');

  mobileCategoryMenu.addEventListener('click', function () {
    gridColumn2.classList.toggle('show');
    gridColumn10.classList.toggle('expanded');
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.grid__column-2') && !event.target.closest('#mobile-category-menu')) {
      gridColumn2.classList.remove('show');
      gridColumn10.classList.remove('expanded');
    }
  });
});

let updateIntervalD, updateIntervalT, updateIntervalP, updateIntervalE;
let isUpdating = false;
let rowNumb = 1;
/* CÀI ĐẶT CÁC NÚT NHẤN CHO 3 CTRINH */
document.addEventListener('DOMContentLoaded', function () {
  let drillState = false; // false means off, true means on
  document.getElementById("startButton").addEventListener("click", function () {
    if (!isUpdating) {
      toggleBlue(this);
      const allPositions = concatenateTableValues();
      sendCommandToESP8266('start', allPositions);

      startUpdatingCharts();
      isUpdating = true;
      //let rowNumb = 1;
      addTableRow()
    }
  });

  //let rowNumb = 1;
  document.getElementById("addRows").addEventListener("click", function () {
    const table = document.getElementById("responsive-table").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
  
    // Add cells to the row
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
  
    //Incread new row
    rowNumb++;
  
    // Add content to the cells
    // updateIntervalD for distance 
    // updateIntervalT for torque
    // updateIntervalP for power 
    // updateIntervalE for encoder
    cell1.innerHTML = Math.floor(Date.now() / 1000);
    // cell2.innerHTML = updateIntervalE;
    // cell3.innerHTML = updateIntervalD;
    // cell4.innerHTML = updateIntervalT;
    // cell5.innerHTML = updateIntervalP;
    cell2.innerHTML = 300;
    cell3.innerHTML = 500;
    cell4.innerHTML = 600;
    cell5.innerHTML = 800;
  });

  document.getElementById("stopButton").addEventListener("click", function () {
    if (isUpdating) {
      toggleBlue(this);
      sendCommandToESP8266('stop');

      stopUpdatingCharts();
      isUpdating = false;
      addTableRow()
    }
  });

  document.getElementById("resetButton").addEventListener("click", function () {
    toggleBlue(this);
    sendCommandToESP8266('reset');
    clearTable();

    resetCharts();
  });
  document.getElementById("exportButton").addEventListener("click", function () {
    //toggleBlue(this);
    //endCommandToESP8266('export');
    exportExcel();
  });

  document.getElementById("DrillButton").addEventListener("click", function () {
    drillState = !drillState; // Toggle the state
    const command = drillState ? "drill/on" : "drill/off";
    sendCommandToESP8266(command);
    updateDrillButtonState(this, drillState);
  });

  function updateDrillButtonState(button, state) {

    const innerSpan = button.querySelector('.toggle-button-inner');
    if (state) {
      button.classList.remove('off');
    } else {
      button.classList.add('off');
    }
  }

  function sendCommandToESP8266(command, data = '') {
    fetch(`/${command}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data ? `data=${encodeURIComponent(data)}` : ''
    })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
  /* Setting nút nhấn sáng */
  function toggleBlue(button) {
    document.getElementById("startButton").classList.remove("blue");
    document.getElementById("stopButton").classList.remove("blue");
    document.getElementById("resetButton").classList.remove("blue");
    document.getElementById("exportButton").classList.remove("blue");
    button.classList.add("blue");
  }

  function concatenateTableValues() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) {
      return ''; // If the table doesn't exist, return an empty string
    }
    const rows = tableBody.getElementsByTagName('tr');
    let result = '';

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      let rowValues = [];
      for (let j = 0; j < cells.length - 1; j++) { // Exclude the last cell with the buttons
        rowValues.push(cells[j].textContent);
      }
      result += (i === 0 ? '' : '\n') + rowValues.join(',');
    }

    return result;
  }

  function clearTable() {
    const tableBody = document.getElementById('table-body');
    if (tableBody) {
      tableBody.innerHTML = '';
    }
  }
});

/* Table */
document.addEventListener('DOMContentLoaded', () => {
  const xPosition = document.getElementById('x-position');
  const yPosition = document.getElementById('y-position');
  const zPosition = document.getElementById('z-position');

  const xValue = document.getElementById('x-value');
  const yValue = document.getElementById('y-value');
  const zValue = document.getElementById('z-value');

  xPosition.addEventListener('input', () => {
    xValue.value = xPosition.value;
    enforceMaxValue(xValue);
  });

  yPosition.addEventListener('input', () => {
    yValue.value = yPosition.value;
    enforceMaxValue(yValue);
  });

  zPosition.addEventListener('input', () => {
    zValue.value = zPosition.value;
    enforceMaxValue(zValue);
  });

  xValue.addEventListener('input', () => {
    xPosition.value = xValue.value;
    enforceMaxValue(xValue);
  });

  yValue.addEventListener('input', () => {
    yPosition.value = yValue.value;
    enforceMaxValue(yValue);
  });

  zValue.addEventListener('input', () => {
    zPosition.value = zValue.value;
    enforceMaxValue(zValue);
  });
});

function enforceMaxValue(input) {
  let value = parseFloat(input.value);
  const max = parseFloat(input.max);

  if (value > max) {
    input.value = max;
  } else if (value < 0) {
    input.value = 0;
  }
}

function submitValues() {
  let xValue = parseInt(document.getElementById('x-value').value, 10);
  let yValue = parseInt(document.getElementById('y-value').value, 10);
  let zValue = parseInt(document.getElementById('z-value').value, 10);

  xValue = validateValue(xValue, 0, 850);
  yValue = validateValue(yValue, 0, 1650);
  zValue = validateValue(zValue, 0, 700);

  console.log(`Submitting values: X=${xValue}, Y=${yValue}, Z=${zValue}`);

  const tableBody = document.getElementById('table-body');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
      <td>${xValue}</td>
      <td>${yValue}</td>
      <td>${zValue}</td>
      <td>
          <button onclick="editRow(this)">Edit</button>
          <button onclick="deleteRow(this)">Delete</button>
      </td>
  `;

  tableBody.appendChild(newRow);
}

function validateValue(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function editRow(button) {
  const row = button.closest('tr');
  const cells = row.getElementsByTagName('td');

  const xValue = cells[0].textContent;
  const yValue = cells[1].textContent;
  const zValue = cells[2].textContent;

  cells[0].innerHTML = `<input type="number" value="${xValue}" class="edit-input" id="edit-x" min="0" max="850" oninput="enforceMaxValue(this)">`;
  cells[1].innerHTML = `<input type="number" value="${yValue}" class="edit-input" id="edit-y" min="0" max="1650" oninput="enforceMaxValue(this)">`;
  cells[2].innerHTML = `<input type="number" value="${zValue}" class="edit-input" id="edit-z" min="0" max="700" oninput="enforceMaxValue(this)">`;

  button.textContent = 'Save';
  button.onclick = function () { saveRow(this); };
}

function saveRow(button) {
  const row = button.closest('tr');
  const cells = row.getElementsByTagName('td');

  let xValue = parseInt(document.getElementById('edit-x').value, 10);
  let yValue = parseInt(document.getElementById('edit-y').value, 10);
  let zValue = parseInt(document.getElementById('edit-z').value, 10);

  xValue = validateValue(xValue, 0, 850);
  yValue = validateValue(yValue, 0, 1650);
  zValue = validateValue(zValue, 0, 700);

  cells[0].textContent = xValue;
  cells[1].textContent = yValue;
  cells[2].textContent = zValue;

  button.textContent = 'Edit';
  button.onclick = function () { editRow(this); };
}

function deleteRow(button) {
  const row = button.closest('tr');
  row.remove();
}

function concatenateTableValues() {
  const tableBody = document.getElementById('table-body');
  const rows = tableBody.getElementsByTagName('tr');
  let result = '';

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    let rowValues = [];
    for (let j = 0; j < cells.length - 1; j++) { // Exclude the last cell with the buttons
      rowValues.push(cells[j].textContent);
    }
    result += (i === 0 ? '' : '\n') + rowValues.join(',');
  }

  return result;
}

function clearTable() {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
}

function toggleBlue(button) {
  document.getElementById("startButton").classList.remove("blue");
  document.getElementById("stopButton").classList.remove("blue");
  document.getElementById("resetButton").classList.remove("blue");
  button.classList.add("blue");
}

/*  srcoll bar */
function syncInputs(rangeInput, numberInput) {
  if (rangeInput != null && numberInput != null){
    rangeInput.addEventListener('input', function () {
      const value = (this.value - this.min) / (this.max - this.min) * 100;
      this.style.background = `linear-gradient(to right, #42b0ff ${value}%, #ccc ${value}%)`;
      numberInput.value = this.value;
    });
  
    numberInput.addEventListener('input', function () {
      rangeInput.value = this.value;
      const value = (this.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
      rangeInput.style.background = `linear-gradient(to right, #42b0ff ${value}%, #ccc ${value}%)`;
    });
  
    // Initialize the background based on the initial value
    rangeInput.dispatchEvent(new Event('input'));
  }
}

const xRange = document.getElementById('x-position');
const xNumber = document.getElementById('x-value');
syncInputs(xRange, xNumber);

const yRange = document.getElementById('y-position');
const yNumber = document.getElementById('y-value');
syncInputs(yRange, yNumber);

const zRange = document.getElementById('z-position');
const zNumber = document.getElementById('z-value');
syncInputs(zRange, zNumber);

/* map cnc */
document.addEventListener("DOMContentLoaded", function () {
  const drillBit = document.getElementById("drill-bit");
  const crosshair = document.getElementById("crosshair");
  const coordinatesDisplay = document.getElementById("coordinates");

  const xRange = document.getElementById('x-position');
  const yRange = document.getElementById('y-position');
  const zRange = document.getElementById('z-position');
  const xNumber = document.getElementById('x-value');
  const yNumber = document.getElementById('y-value');
  const zNumber = document.getElementById('z-value');

  const woodPiece = document.querySelector('.wood-piece');
  const yellowBarleft = document.querySelector('.yellow-bar.left');
  const yellowBarright = document.querySelector('.yellow-bar.right');

  let position = { x: 0, y: 0, z: 0 };
  let intervalId = null;
  let positions = [];
  let currentIndex = 0;
  let lastPositions = [];

  const smallScreen = window.matchMedia("(max-width: 740px)");

  function syncInputs(rangeInput, numberInput, positionType) {
    rangeInput.addEventListener('input', function () {
      const value = (this.value - this.min) / (this.max - this.min) * 100;
      this.style.background = `linear-gradient(to right, #42b0ff ${value}%, #ccc ${value}%)`;
      numberInput.value = this.value;
      if (positionType === 'woodPiece') {
        updateWoodPiecePosition(parseInt(xRange.value, 10), parseInt(zRange.value, 10));
      } else if (positionType === 'drillBit') {
        updateDrillBitPosition(parseInt(yRange.value, 10));
      }
    });

    numberInput.addEventListener('input', function () {
      rangeInput.value = this.value;
      const value = (this.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
      rangeInput.style.background = `linear-gradient(to right, #42b0ff ${value}%, #ccc ${value}%)`;
      if (positionType === 'woodPiece') {
        updateWoodPiecePosition(parseInt(xRange.value, 10), parseInt(zRange.value, 10));
      } else if (positionType === 'drillBit') {
        updateDrillBitPosition(parseInt(yRange.value, 10));
      }
    });
    rangeInput.dispatchEvent(new Event('input'));
  }

  syncInputs(xRange, xNumber, 'woodPiece'); // Control wood - yellowbar
  syncInputs(yRange, yNumber, 'drillBit'); // Control drill bit center
  syncInputs(zRange, zNumber, 'woodPiece'); // Control wood - yellowbar

  function cncToPixels(cncX, cncY) {
    const isSmallScreen = smallScreen.matches;
    const panelWidth = isSmallScreen ? 295 : 497;
    const panelHeight = isSmallScreen ? 347 : 498;

    const originX = panelWidth;
    const originY = panelHeight;

    const pixelY = originY - (cncY / 1650) * panelHeight;
    const pixelX = originX - (cncX / 2250) * panelWidth;

    return { pixelX, pixelY };
  }



  function updateWoodPiecePosition(cncX, cncZ) {
    position.x = parseInt(cncX, 10);
    position.z = parseInt(cncZ, 10);
    const { pixelX, pixelY } = cncToPixels(position.x, 0); // Using 0 for y-axis for woodPiece

    const panelWidth = smallScreen.matches ? 295 : 497;
    const panelHeight = smallScreen.matches ? 347 : 498;

    // Update position for woodPiece and yellowBar
    const yellowBarHeight = yellowBarleft.offsetHeight;
    const maxPenHeight = panelHeight - yellowBarHeight;

    yellowBarleft.style.top = `${Math.max(0, Math.min(maxPenHeight, pixelX - yellowBarHeight))}px`;
    yellowBarright.style.top = `${Math.max(0, Math.min(maxPenHeight, pixelX - yellowBarHeight))}px`;

    const yellowBarLeftPos = yellowBarleft.offsetLeft;
    const yellowBarRightPos = yellowBarright.offsetLeft + yellowBarright.offsetWidth;
    const centerPosition = (yellowBarLeftPos + yellowBarRightPos) / 2;

    const woodPieceWidth = woodPiece.offsetWidth;
    const woodPieceLeft = Math.max(0, Math.min(panelWidth - woodPieceWidth, centerPosition - (woodPieceWidth / 2)));
    woodPiece.style.left = `${woodPieceLeft}px`;

    const bottomPosition = yellowBarright.offsetTop + yellowBarright.offsetHeight;
    woodPiece.style.top = `${Math.max(0, bottomPosition - woodPiece.offsetHeight * 1.5)}px`;
  }

  function updateDrillBitPosition(cncY) {
    position.y = parseInt(cncY, 10);
    const { pixelX, pixelY } = cncToPixels(1570, position.y); // Using 0 for x-axis for drillBit

    const panelWidth = smallScreen.matches ? 295 : 497;
    const panelHeight = smallScreen.matches ? 347 : 498;

    // Update position for drillBit and crosshair
    drillBit.style.top = `${pixelX - 10}px`;
    drillBit.style.left = `${pixelY - 10}px`;
    crosshair.style.top = `${pixelX - 2}px`;
    crosshair.style.left = `${pixelY - 2}px`;
    coordinatesDisplay.textContent = `X: ${position.x}, Y: ${position.y}, Z: ${position.z}`;
  }

  function parseTablePositions() {
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');
    positions = [];
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      let x = parseInt(cells[0].textContent, 10);
      let y = parseInt(cells[1].textContent, 10);
      let z = parseInt(cells[2].textContent, 10);
      positions.push({ x, y, z });
    }
  }

  function moveToTarget(targetPosition, callback) {
    const speed = 1;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      let deltaX = targetPosition.x - position.x;
      let deltaY = targetPosition.y - position.y;
      let deltaZ = targetPosition.z - position.z;

      if (Math.abs(deltaX) <= speed && Math.abs(deltaY) <= speed && Math.abs(deltaZ) <= speed) {
        updateWoodPiecePosition(targetPosition.x, targetPosition.z);
        updateDrillBitPosition(targetPosition.y);
        clearInterval(intervalId);
        if (callback) callback();
        return;
      }

      let newX = position.x + (deltaX > 0 ? speed : -speed);
      let newY = position.y + (deltaY > 0 ? speed : -speed);
      let newZ = position.z + (deltaZ > 0 ? speed : -speed);

      updateWoodPiecePosition(newX, newZ);
      updateDrillBitPosition(newY);
    }, 5);
  }

  function startMovement() {
    updateWoodPiecePosition(0, 0);
    updateDrillBitPosition(0); // Initialize drill bit position
    parseTablePositions();
    if (positions.length === 0) {
      positions = lastPositions.slice();
    } else {
      lastPositions = positions.slice();
    }

    if (positions.length === 0) return;

    currentIndex = 0;
    moveToNextPosition();
  }

  function moveToNextPosition() {
    if (currentIndex >= positions.length) {
      currentIndex = 0;
    }
    const targetPosition = positions[currentIndex];
    currentIndex++;
    moveToTarget(targetPosition, moveToNextPosition);
  }

  document.getElementById("startButton").addEventListener("click", function () {
    startMovement();
  });

  document.getElementById("stopButton").addEventListener("click", function () {
    clearInterval(intervalId);
  });

  document.getElementById("resetButton").addEventListener("click", function () {
    clearInterval(intervalId);
    updateWoodPiecePosition(0, 0);
    updateDrillBitPosition(0); // Reset drill bit position
    positions = [];

    const bottomPosition = yellowBarright.offsetTop + yellowBarright.offsetHeight;
    woodPiece.style.top = `${bottomPosition - woodPiece.offsetHeight * 1.5}px`;
    yellowBarleft.style.top = `${yellowBarright.offsetTop}px`;
    yellowBarright.style.top = `${yellowBarright.offsetTop}px`;
    woodPiece.style.left = yellowBarleft.style.left;
  });

  smallScreen.addEventListener('change', function () {
    updateWoodPiecePosition(position.x, position.z);
    updateDrillBitPosition(position.y);
  });

  updateWoodPiecePosition(0, 0);
  updateDrillBitPosition(0); // Initialize drill bit position
});



// Function to start updating charts
function startUpdatingCharts() {
  if (!updateIntervalD) {
    updateIntervalD = setInterval(function () { requestData("/distance", chartD); }, 300);
  }
  if (!updateIntervalT) {
    updateIntervalT = setInterval(function () { requestData("/torque", chartT); }, 300);
  }
  // if (!updateIntervalP) {
  //   updateIntervalP = setInterval(function () { requestData("/power", chartP); }, 300);
  // }
  if (!updateIntervalE) {
    updateIntervalE = setInterval(function () { requestData("/encoder", chartE); }, 300);
  }
}

// Function to stop updating charts
function stopUpdatingCharts() {
  clearInterval(updateIntervalD);
  clearInterval(updateIntervalT);
  clearInterval(updateIntervalP);
  clearInterval(updateIntervalE);
  updateIntervalD = null;
  updateIntervalT = null;
  updateIntervalP = null;
  updateIntervalE = null;
}

// Function to reset charts
function resetCharts() {
  chartD.series[0].setData([]);
  chartT.series[0].setData([]);
  chartP.series[0].setData([]);
  chartE.series[0].setData([]);
}

function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.display = 'block';
  status.className = isError ? 'error' : 'success';
  setTimeout(() => {
      status.style.display = 'none';
  }, 3000);
}

function addTableRow() {
  const table = document.getElementById("responsive-table").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
  
    // Add cells to the row
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
  
    //Incread new row
    rowNumb++;
  
    // Add content to the cells
    // updateIntervalD for distance 
    // updateIntervalT for torque
    // updateIntervalP for power 
    // updateIntervalE for encoder
    console.log("A: " , updateIntervalE)
    console.log("B: " , updateIntervalD)
    console.log("C: " , updateIntervalT)
    console.log("D: " , updateIntervalP)
    cell1.innerHTML = Math.floor(Date.now() / 1000);
    cell2.innerHTML = updateIntervalE;
    cell3.innerHTML = updateIntervalD;
    cell4.innerHTML = updateIntervalT;
    cell5.innerHTML = updateIntervalP;
    // cell2.innerHTML = 300;
    // cell3.innerHTML = 500;
    // cell4.innerHTML = 600;
    // cell5.innerHTML = 800;
}

function exportExcel() {
  try {
      const table = document.getElementById("responsive-table");
      if (!table) {
          showStatus('Table not found', true);
          return;
      }

      // Create CSV content
      const rows = [];
      
      // Get headers
      const headers = Array.from(table.rows[0].cells).map(cell => cell.textContent);
      rows.push(headers.join(','));
      
      // Get data rows
      for (let i = 1; i < table.rows.length; i++) {
          const row = table.rows[i];
          const rowData = Array.from(row.cells).map(cell => `"${cell.textContent}"`);
          rows.push(rowData.join(','));
      }
      
      // Create CSV content
      const csvContent = rows.join('\n');
      
      // Create downloadable link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'table_data.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showStatus('Table exported successfully');
  } catch (error) {
      showStatus('Error exporting table: ' + error.message, true);
  }
}











