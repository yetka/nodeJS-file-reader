// makes sure that user inputs filename as ARGV
if (process.argv.length < 3) {
  const nodeFilenamePath = process.argv[1];
  const path = require('path');
  const nodeFilename = path.basename(nodeFilenamePath);
  console.log('For proper usage type: node ' + nodeFilename + ' FILENAME');
  process.exit(1);
}

// extracts userFilename from ARGV
const userFilename = process.argv[2];

// uses 'fs' node module to read data from file
const fs = require('fs');

fs.readFile(userFilename, 'utf8', function(err, data) {
  if (err) {
    console.log(err.message);
  } else {
  console.log('Processed file: ' + userFilename);
  let teamRanking = rankingCalculator(data);
  console.log(teamRanking);
  }
  
});

// function to calculate ranking in a soccer league
function rankingCalculator(data) {
  let ranking = {};
  const games = data.split('\n');
  games.forEach(function(game) {
    
    //team1 info
    let team1 = (game.split(',')[0]).trim();
    let team1Info = teamGameInfoExtractor(team1);
    let team1Name = team1Info[0];
    let team1Score = team1Info[1];
    
    //team2 info
    let team2 = (game.split(',')[1]).trim();
    let team2Info = teamGameInfoExtractor(team2);
    let team2Name = team2Info[0];
    let team2Score = team2Info[1];
    
    //calculate each game ranking
    let singleGameRanking = gameScoreCalculator(team1Name, team1Score, team2Name, team2Score);
    
    // change ranking collection after each game
    let teams = Object.keys(ranking);
    if ((!teams.includes(team1Name)) && (!teams.includes(team2Name))) {
      Object.assign(ranking, singleGameRanking);
    } else if ((teams.includes(team1Name)) && (teams.includes(team2Name))) {
      let temp1 = ranking[team1Name];
      ranking[team1Name] = temp1 + singleGameRanking[team1Name];
      let temp2 = ranking[team2Name];
      ranking[team2Name] = temp2 + singleGameRanking[team2Name];
    } else if (teams.includes(team1Name)) {
      let temp1 = ranking[team1Name];
      ranking[team1Name] = temp1 + singleGameRanking[team1Name];
    } else {
      let temp2 = ranking[team2Name];
      ranking[team2Name] = temp2 + singleGameRanking[team2Name];
    }
  })
  return ranking;
}

// function to extract data (teams names and scores) about each team from a game
function teamGameInfoExtractor(team) {
  let teamArray = team.split(' ');
  let teamScore = teamArray[teamArray.length - 1]; // score
  teamArray.splice(-1);
  let teamName = teamArray.join(' '); // name
  let teamInfo = [];
  teamInfo.push(teamName);
  teamInfo.push(teamScore);
  return teamInfo;
}

// function to calculate scores for each game, return value is an object with teamName as key and teamScore as value
function gameScoreCalculator(team1Name, team1Score, team2Name, team2Score) {
  let gameRanking = {};
  if(team1Score === team2Score) {
    gameRanking[team1Name] = 1;
    gameRanking[team2Name] = 1;
  } else if (team1Score > team2Score) {
    gameRanking[team1Name] = 3;
    gameRanking[team2Name] = 0;
  } else {
    gameRanking[team2Name] = 3;
    gameRanking[team1Name] = 0;
  }
  return gameRanking;
}

// function to sort by rating and alphabeticaly and print it 
function sortTeams(teamRanking) {
  
}