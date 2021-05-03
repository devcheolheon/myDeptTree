function makeDir(deptRoads, deptRoadsIndex) {
  var isLink = true;
  var dept_no = null;

  dept_no = deptRoads.nameArray
    .slice(0, deptRoadsIndex + 1)
    .fill("", deptRoadsIndex + 1, 3)
    .join("-");

  var dept_name = deptRoads.nameArray[deptRoadsIndex];
  var result = {
    subDir: [],
  };

  result.isLink = isLink;
  if (isLink) result.dept_no = dept_no;
  result.dept_name = dept_name;

  return result;
}

function appendNewDept(directoryObject, newDirObject) {
  directoryObject.subDir.push(newDirObject);
}

function insertNewDept(deptRoads, deptRoadsIndex, directoryObject) {
  if (deptRoads.nameArray.length === deptRoadsIndex) return;
  var newDirObject = makeDir(deptRoads, deptRoadsIndex);
  appendNewDept(directoryObject, newDirObject);
  insertNewDept(deptRoads, deptRoadsIndex + 1, newDirObject);
}

function findNewSubDeptAndInsert(deptRoads, deptRoadsIndex, directoryObject) {
  if (deptRoads.nameArray.length === deptRoadsIndex) return;
  var dirName = deptRoads.nameArray[deptRoadsIndex];
  var targetDir = directoryObject.subDir.find(function (dir) {
    return dir.dept_name == dirName;
  });
  if (targetDir) {
    findNewSubDeptAndInsert(deptRoads, deptRoadsIndex + 1, targetDir);
  } else {
    insertNewDept(deptRoads, deptRoadsIndex, directoryObject);
  }
}

function makeDirectoryObject(data) {
  var root = {
    isRootDir: true,
    isLink: true,
    dept_name: "전체",
    subDir: [],
    dept_no: "",
  };
  for (var i = 0; i < data.length; i++) {
    var deptRoads = data[i];
    deptRoads.nameArray = data[i].dept_name.split(",");
    if (data[i].dept_name.indexOf("전체") > -1) continue;
    findNewSubDeptAndInsert(deptRoads, 0, root);
  }
  return root;
}

function makeHTMLString(dirObject) {
  var hasSubDir = dirObject.subDir.length > 0;
  var result = dirObject.isLink
    ? makeLinkLi(dirObject, hasSubDir)
    : makeLi(dirObject, hasSubDir);
  if (dirObject.subDir.length > 0) {
    result += '<ol class="dept_tree_view">';
    result += dirObject.subDir.map(makeHTMLString).join("");
    result += "</ol>";
  }
  result += "</li>";
  return result;
}

function makeLi(dirObject, hasSubDir) {
  var preString =
    '<li class="dept_element dept_tree_view ' +
    (hasSubDir ? "hassubdir" : "") +
    '">';
  preString +=
    '<div class="dept_line dept_tree_view "><div class="dept_tree_view cubeArea"><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div></div>';
  preString +=
    '<div class="miniArea dept_tree_view">' +
    (hasSubDir
      ? '<div id="plus" class="dept_tree_view icon close"></div>'
      : "") +
    "</div>";
  preString += '<div class="dept_name dept_tree_view no_link_dept">';
  return preString + dirObject.dept_name + "</div></div>";
}

function makeLinkLi(dirObject, hasSubDir) {
  var preString =
    '<li class="dept_element dept_tree_view ' +
    (hasSubDir ? "hassubdir" : "") +
    '">';
  preString +=
    '<div class="dept_line dept_tree_view ' +
    (hasSubDir ? "hassubdir" : "") +
    '"><div class="dept_tree_view cubeArea"><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div><div class="dept_tree_view cube"></div></div>';
  preString +=
    '<div class="miniArea dept_tree_view">' +
    (hasSubDir
      ? '<div id="plus" class="dept_tree_view icon close"></div>'
      : "") +
    "</div>";
  preString +=
    '<div class="dept_name dept_tree_view" ><a href="javascript:void(0)" data-deptno=' +
    '"' +
    dirObject.dept_no +
    '" >';
  var subString = "</a></div></div>";
  return preString + dirObject.dept_name + subString;
}

var dept_total_id = 0;

function createDeptTree(targetID, dept_data, clickHandler, type = "") {
  var directoryObject = makeDirectoryObject(dept_data);

  var targetOl = document.querySelector("#" + targetID);
  targetOl.innerHTML = makeHTMLString(directoryObject);

  targetOl = $(targetOl);
  targetOl.addClass(type);
  targetOl.addClass("dept_tree_view");
  targetOl.find(".icon").on("click", function (event) {
    var me = $(event.target);
    var parentLi = me.closest("li");
    me.toggleClass("close");

    parentLi.siblings("li").find("ol").addClass("close");
    parentLi.siblings("li").find(".icon").addClass("close");

    parentLi.children("ol").toggleClass("close").find("ol").addClass("close");
    parentLi.children("ol").find(".icon").addClass("close");

    event.stopPropagation();
  });

  targetOl.find("ol").addClass("close");
  targetOl.children("li").children("ol").removeClass("close");
  targetOl
    .children("li")
    .children(".dept_line")
    .children(".miniArea")
    .children(".icon")
    .removeClass("close");

  targetOl.on("click", "a", function (e) {
    clickHandler(e.target.dataset["deptno"]);
  });

  return targetOl;
}

function openDeptTree(targetID, deptName) {
  console.log(deptName);
  console.log(targetID);
  var targetOl = $(document.querySelector("#" + targetID));

  targetOl
    .find('.dept_name:contains("' + deptName + '")')
    .filter(function () {
      return $(this).text() == deptName;
    })
    .parents("#" + targetID + " ol")
    .removeClass("close")
    .end()
    .addClass("found");
}
