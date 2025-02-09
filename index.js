function reset() {
  easyCircle.style.setProperty("--x", "0%");
  easyCircle.firstElementChild.innerText = "";
  mediumCircle.style.setProperty("--x", "0%");
  mediumCircle.firstElementChild.innerText = "";
  hardCircle.style.setProperty("--x", "0%");
  hardCircle.firstElementChild.innerText = "";
}

function addElement(obj) {
  const target = document.querySelector(".card-stats");
  const d = document.createElement("div");
  d.style.width = "100%";
  for (let i of obj) {
    console.log(i);
    const ele = document.createElement("div");
    const c1 = document.createElement("p");
    const c2 = document.createElement("p");
    if (i.difficulty == "All") {
      c1.innerText = "All Submissions";
    } else if (i.difficulty == "Easy") {
      c1.innerText = "Easy Submissions";
    } else if (i.difficulty == "Medium") {
      c1.innerText = "Medium Submissions";
    } else {
      c1.innerText = "Hard Submissions";
    }
    c2.innerText = `${i.submissions}`;
    ele.append(c1);
    ele.append(c2);
    d.appendChild(ele);
    ele.classList.add("added");
  }
  console.log(target);
  d.classList.add("added-parent");
  if (target.firstChild) {
    target.replaceChild(d, target.firstChild);
  } else {
    target.appendChild(d);
  }
}

function display(count, total, updatecircle, updatepara) {
  updatecircle.style.setProperty("--x", `${(count / total) * 100}%`);
  console.log(updatecircle.firstElementChild);
  updatecircle.firstElementChild.innerText = `${count}/${total}`;
  updatecircle.firstElementChild.classList.add("des");
}

function displayUserdata(data) {
  totalEasy = data.allQuestionsCount[1].count;
  totalMedium = data.allQuestionsCount[2].count;
  totalHard = data.allQuestionsCount[3].count;
  solvedEasy = data.matchedUser.submitStats.acSubmissionNum[1].count;
  solvedMedium = data.matchedUser.submitStats.acSubmissionNum[2].count;
  solvedHard = data.matchedUser.submitStats.acSubmissionNum[3].count;
  submissions = data.matchedUser.submitStats.totalSubmissionNum;

  display(solvedEasy, totalEasy, easyCircle, easypara);
  display(solvedMedium, totalMedium, mediumCircle, medpara);
  display(solvedHard, totalHard, hardCircle, hardpara);
  addElement(submissions);
}

const fetchUser = async (username) => {
  try {
    bntVal.innerText = "Submitting";
    btn.disabled = true;
    const response = await fetch(
      "https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com/",
        },
        body: JSON.stringify({
          query:
            "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
          variables: { username },
        }),
      }
    );

    const Data = await response.json();
    console.log(Data);
    if (Data.errors) {
      reset();
      throw new Error("error ayya hai..");
    }
    displayUserdata(Data.data);
  } catch (error) {
    cardStats.innerHTML = "<p class='st'>User doesn't exists.</p>";
    console.log(error);
  } finally {
    btn.innerText = "Submit";
    btn.disabled = false;
  }
};

const validate = function (username) {
  if (username.trim() === "") {
    alert("Please enter valid username");
    return false;
  }
  const regex = /^(?!_)(?!.*__)(?!.*_$)[A-Za-z0-9_]{1,15}$/;

  if (regex.test(username)) return true;
  reset();
  return false;
};

window.addEventListener("DOMContentLoaded", function () {
  inputData = document.querySelector("#ip-field");
  bntVal = document.querySelector("#btn");
  cardStats = document.querySelector(".card-stats");
  easyCircle = document.querySelector(".easy");
  mediumCircle = document.querySelector(".medium");
  hardCircle = document.querySelector(".hard");
  easypara = document.querySelector("#easy");
  medpara = document.querySelector("#medium");
  hardpara = document.querySelector("#hard");

  bntVal.addEventListener("click", function () {
    userData = inputData.value;
    console.log(userData);
    if (validate(userData)) fetchUser(userData);
  });
});
