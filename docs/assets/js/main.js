$(() => {
  var el = $(".resizable");
  (uiable = (i = $("div.resizable").length) => {
    $(function() {
      $(`.text${i}`).resizable({
        alsoResize: `.head${i}`
      });
      $(".resizable").draggable();
    });
  })();
  memoposition = i => {
    //ちょっとずらす
    $(`.resizable:has('.head${i}')`).css({
      top: `${i * 2 + 15}px`,
      left: `${i * 2 + 31}px`
    });
  };

  addmemo = () => {
    //$(this).next().attr("class").slice(-1)
    let i, template;
    if (fusenArr.length == 0) i = 1;
    else i = fusenArr[fusenArr.length - 1] + 1; //最後の番号+1
    // console.log(i);
    template =
      '<div class="ui-widget-content resizable">' +
      `<textarea class="head${i}" placeholder="タイトル"></textarea><span class="ui-icon ui-icon-circle-close"></span>` +
      `<textarea class="text${i}" placeholder="本文"></textarea>` +
      "</div>";
    $("body").append(template);
    uiable(i);
    memoposition(i);
    //memo_zIndex();
    fusenArr.push(i);
    // setFusen(i);
  };
  $("#addMemo").on("click", function() {
    addmemo();
    keyupFusen();
    // removeFusen();書き方変えたらいらなそうだった；
  });

  var x = 1;
  (memo_zIndex = () => {
    $(document).on("mousedown", ".resizable", function() {
      $(this).css("z-index", x);
      x++;
    });
    $(document).on("mouseup", ".resizable", function() {
      setFusen($(".resizable").index(this) + 1);
    });
  })();

  (keyupFusen = () => {
    $(document).on("keyup", '[class^="head"]', function() {
      setFusen($(`[class^="head"]`).index(this) + 1); //fusenArrの番号を参照させたい
    });
    $(document).on("keyup", '[class^="text"]', function() {
      setFusen($(`[class^="text"]`).index(this) + 1);
    });
  })();

  var fusenArr = [1];
  setFusen = i => {
    // console.trace()
    let head = $(`.head${i}`);
    let text = $(`.text${i}`);
    let fusenLog = {
      head: head.val(),
      text: text.val(),
      width: text.css("width").slice(0, -2),
      height: text.css("height").slice(0, -2),
      top: head
        .parent()
        .css("top")
        .slice(0, -2),
      left: head
        .parent()
        .css("left")
        .slice(0, -2),
      z: head.parent().css("z-index")
    };
    setStorage(`fusen${i}`, fusenLog);
    setStorage(`fusenArr`, fusenArr);
  };
  setStorage = (key, value) => {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  };
  var arr, fusenLog;
  (readFusen = () => {
    arr = localStorage.getItem("fusenArr");
    // console.log("arr.length"+arr.length,arr);
    for (let i = 1; i <= localStorage.length - 1; i++) {
      //arr.length+1
      if (i != 1) addmemo();
      let head = $(`.head${i}`);
      let text = $(`.text${i}`);
      fusenLog = JSON.parse(localStorage.getItem(`fusen${i}`));
      // console.log(i);
      head.val(fusenLog != null ? fusenLog.head : "タイトル");
      text.val(fusenLog != null ? fusenLog.text : "本文");
      head.css("width", fusenLog.width);
      head.parent().css({
        left: fusenLog.left + "px",
        top: fusenLog.top + "px",
        "z-index": fusenLog.z
      });
      text.css({
        width: Number(fusenLog.width) + 12,
        height: fusenLog.height
      });
      // text.css("height",fusenLog.height);
    }
  })();
  (removeFusen = () => {
    $(document).on("click", ".ui-icon-circle-close", function() {
      $(this)
        .parent()
        .remove();
      let fusenNum = $(this)
        .next()
        .attr("class")
        .slice(4);
      localStorage.removeItem(`fusen${fusenNum}`);
      let remIndex = fusenArr.indexOf(Number(fusenNum)); //fusenNumの場所
      console.table(fusenArr);
      console.log(remIndex, fusenNum);
      if (remIndex != -1) {
        fusenArr.splice(remIndex, 1);
        if (fusenArr.length == 0) {
          localStorage.removeItem("fusenArr");
        } else {
          setStorage(`fusenArr`, fusenArr);
          // let fusenNum;
          // for (var i = 0; i < fusenArr.length; i++) {
          //   fusenNum += `${fusenArr[i]}`
          // }
          // setStorage(`fusenArr`,fusenNum);
        }
      } else {
        console.error(fusenArr);
        console.trace();
      }
    });
  })();
});
