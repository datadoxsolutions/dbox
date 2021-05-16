var canvasD;
function generateLineRubber() {
  canvasD = document.createElement('canvas'); //Create a canvas element
  canvasD.width = $('#itemContainer').width();
  canvasD.height = $(window).height();
  canvasD.style.position = 'absolute';
  canvasD.style.zIndex = 100000;
  canvasD.style.pointerEvents = 'none'; //Make sure you can click 'through' the canvas
  canvasD.id = 'lineDraw';
  document.getElementById('itemContainer').appendChild(canvasD);
}

function getCtxRubber(rectangleBox) {
  const ctx = canvasD.getContext('2d');
  ctx.beginPath();
  const inputOffset = $('input.lastClick').offset();
  if(inputOffset.top) {
    const leftside = document.getElementById('form_advanced_validation').clientWidth - 3;
    console.log(inputOffset);
    // Start and end points
    ctx.beginPath();
    ctx.arc(leftside + 13, inputOffset.top - 220, 6, 0, 2 * Math.PI);   // Start point
    ctx.strokeStyle = '#0bb3ff';
    ctx.stroke();

    ctx.moveTo(leftside + 19, inputOffset.top - 220);

    const rectangleBoxOffsetLeft = document.getElementById(rectangleBox).offsetLeft;
    const rectangleBoxOffsetTop = document.getElementById(rectangleBox).offsetTop; //$('#rectangleBox').offset();
    const scrollDiv = document.getElementById('pdf-canvass').clientWidth;
    const pageIdWidth = document.getElementById('page1').clientWidth;
    console.log(rectangleBoxOffsetTop, rectangleBoxOffsetLeft, scrollDiv, pageIdWidth);
    const offsetRectagle = $('#'+rectangleBox).offset();


    const scrollTop = rectangleBoxOffsetTop - $('#pdf-canvass').scrollTop();

    // element lenght
    const elemetDivideLenght = rectangleBoxOffsetLeft / 2;
    let extraLenght = (pageIdWidth < scrollDiv) ? (scrollDiv - pageIdWidth) :  ( pageIdWidth - scrollDiv);
    const leftWidth = $('#leftSide').width() + 40;
    // console.log("leftside", $('#leftSide').width() + 40, rectangleBoxOffsetLeft );
    const start = {x: ( leftWidth + (elemetDivideLenght + (elemetDivideLenght / 2))), y: (scrollTop + 61)};
    const curvepoint = {x: (leftWidth + (elemetDivideLenght + (elemetDivideLenght / 2))), y: (scrollTop + 61)};
    const end = {x: ( leftWidth + rectangleBoxOffsetLeft), y: (offsetRectagle.top - 240)};

    // console.log(start.x, start.y, curvepoint.x, curvepoint.y, end.x, end.y, $('#rectangleBox'), $('#pdf-canvass'));
    // start.x = 480 + 80;
    // start.y = 120;
    // curvepoint.x = 480 + 80;
    // curvepoint.y = 120;
    // end.x = 480 + 80;
    // end.y = 120;

    ctx.bezierCurveTo(start.x, start.y, curvepoint.x, curvepoint.y, end.x, end.y);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function rubberbindingElement(id, text) {
  $('#lineDraw, #rectangleBox, #selectedBindingData').remove();
  generateLineRubber();
  getCtxRubber(id);
  $('.rubberbiding-rect').removeClass('active');
  $('#'+id).addClass('active');
  $('#page1').after('<div id="selectedBindingData" data-id="'+id+'"></div>');
}