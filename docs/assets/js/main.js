$(() => {

  var STORAGE_KEY = "FUSEN/MEMOS"

  var templates = {};
  templates.memo =
    '<div class="memo ui-widget-content">' +
      '<textarea class="memo_title" placeholder="タイトル"></textarea>' +
      '<span class="memo_close ui-icon ui-icon-circle-close"></span>' +
      '<textarea class="memo_body" placeholder="本文"></textarea>' +
    '</div>';

  var initPosition = {
    top: 40,
    left: 40,
  }

  function append (memo) {

    if (!memo) {
      memo = {
        id: "memo_" + new Date().getTime(),
        title: "",
        body: "",
      }
    }

    var ele = $(templates.memo)

    ele
      .attr({ id: memo.id})
      .css({
        top: initPosition.top,
        left: initPosition.left,
      })
      .appendTo("#app")

    $(ele).find(".memo_title").val(memo.title)
    $(ele).find(".memo_body").val(memo.body)
    $(ele).find("textarea").change(save)

    $(ele).find(".memo_close").click(function(){
      ele.remove()
      save()
    })

    $(ele)
      .resizable()
      .draggable({
        start: function(){
          initPosition.top = 40
          initPosition.left = 40
        }
      })

    initPosition.top += 15
    initPosition.left += 31

    $(ele).find(".memo_title").focus()

    save()
  }

  function save() {
    var memos = []

    $(".memo").each(function(){
      var memo = {}

      memo.id = $(this).attr("id")
      memo.title = $(this).find(".memo_title").val()
      memo.body = $(this).find(".memo_body").val()

      memos.push(memo)
    })

    var json = JSON.stringify(memos)
    localStorage.setItem(STORAGE_KEY, json)
  }

  function load() {
    var json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      append()
      return
    }

    var memos = JSON.parse(json)
    memos.forEach(function(memo){
      append(memo)
    })
  }

  load()

  $("#appendButton").click(append)

});
