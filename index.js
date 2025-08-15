document.addEventListener("DOMContentLoaded", function(){
      
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsConstainer = document.querySelector(".stats-card");

//true and false based on username status
     function validateUsername(username){
      if(username.trim() === ""){
        alert("username should not be empty")
        return false;
      }
      const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    
      const isMatching = regex.test(username);
      if (!isMatching){
        alert("invalid Username"); 
      }
      return isMatching;
     }

      
     async function fetchUserDetails(username){
 

       const url = `https://leetcode-stats-api.herokuapp.com/${username}`
           try{
            if(searchButton){
            searchButton.textContent = "Searching..."
            searchButton.disabled = true;
          
          }

            //const response = await fetch(url);

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
              query: "\n query userSessionProgress ($username: String!){\n allQuestionsCount {\n difficulty\n count\n  } \n matchedUser(username: $username){\submitStatsGlobal { \n acSubmissionNum{\n  difficulty\n   count\n submissions\n } \n totalSubmissionNum {\n difficulty\n  count\n submissions\n }\n  }\n  }\n} \n",variables: {"username": `${username}`}}
            )

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: graphql,
              redirect:"follow"
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);


              if(!response.ok){
                throw new Error("Unable to fetch the user details");

              }
              const parsedData = await response.json();
              console.log("Logging data: ", parsedData);

              displayuserData(parsedData);

           } catch(error){
            console.log(error);
            statsContainer.innerHTML = `<p>No data Found</p>`

           }
           finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;

           }

        
    }

  
    function updateProgress(solved, total, label, circle){
           const progressDegree = (solved/total)*100;
           if(circle){
           circle.style.setProperty("--progress-degree",`${progressDegree}%`);}

           if(label){
           label.textContent = `${solved}/${total}`;}
           else{
            console.log(label);
           }
    }

    

    function displayuserData(parsedData) {
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalmediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;
        const solvedTotalQues = parsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[1].count;
        const solvedTotalmediumQues = parsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStatsGlobal.acSubmissionNum[3].count;
        
    //function displayuserData(parsedData) {
    // const {
    //     totalQues : totalQuestions = 0,
    //     totalEasy: totalEasyQues = 0,
    //     totalMedium: totalmediumQues = 0,
    //     totalHard: totalHardQues = 0,
    //     totalSolved: solvedTotalQues = 0,
    //     easySolved: solvedTotalEasyQues = 0,
    //     mediumSolved: solvedTotalmediumQues = 0,
    //     hardSolved: solvedTotalHardQues = 0
    // } = parsedData || {};
        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalmediumQues, totalmediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

             const cardData = [
               {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[0].submissions},
               {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[1].submissions},
               {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[2].submissions},
               {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStatsGlobal.totalSubmissionNum[3].submissions}
              ]
            
console.log(cardData)
cardStatsConstainer.innerHTML = cardData.map(
  data => `
    <div class = "card">
    <h4>${data.label}</h4>
    <p>${data.value}</p>
    </div>
    `
).join("")

          }

    searchButton.addEventListener('click', function(){

        const username = usernameInput.value;
        console.log("logging username", username);
        
        if(validateUsername(username)){
                fetchUserDetails(username);
        }
    } )
})