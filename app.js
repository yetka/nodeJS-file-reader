// validates of user's input
if ((process.argv.length < 3) || (process.argv.length > 3)) {
  const nodeFilenamePath = process.argv[1];
  const path = require('path');
  const nodeFilename = path.basename(nodeFilenamePath);
  console.log('Invalid input. Type: node ' + nodeFilename + ' FILENAME');
  process.exit(1);
}


const fs = require('fs'); // uses 'fs' node module to manipulate on files system

const userFilename = process.argv[2]; // extracts userFilename from ARGV to use it in readFile method

// reads data from file using async readFile method
fs.readFile(userFilename, 'utf8', function(err, data) {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Processed file: ' + userFilename);
    const games = fileProcessor(data); 
    const ranking = gamePointsCalculator(games);
    const groups = groupsConstructor(ranking);
    groupsSortPrint(groups);
  }
  
});

// class for team points results
class TeamResult {
  constructor(name, points) {
    this.teamName = name;
    this.teamPoints = points;
  }
}

class GameResult {
  constructor(team1, team2) {
    this.team1 = team1;
    this.team2 = team2;
  }
}

function teamStringParse(team) {
  team = team.trim();
  let teamArray = team.split(' ');
  let teamScore = parseInt(teamArray.pop()); // scores (number)
  let teamName = teamArray.join(' '); // name
  return new TeamResult(teamName, teamScore);
}

// function to extract data from file and transform it into array of objects (GameResult class instances)
function fileProcessor(data) {
  const games = [];
  const fileLines = data.split('\n');
  fileLines.forEach(function(line) { 
    let [team1, team2] = line.split(',');
    let game = new GameResult(teamStringParse(team1),teamStringParse(team2));
    games.push(game);
  });
  return games;  
}

// function to calculate points for each game, return value is map
function gamePointsCalculator(games) {
  const gameRanking = {};
  games.forEach(function(game) {
    let {team1, team2} = game;
    if (team1.teamPoints === team2.teamPoints) { // change scores into points
      team1.teamPoints = 1;
      team2.teamPoints = 1;
    } else if (team1.teamPoints > team2.teamPoints) {
      team1.teamPoints = 3;
      team2.teamPoints = 0;
    } else {
      team1.teamPoints = 0;
      team2.teamPoints = 3;
    }
    
    if (gameRanking[team1.teamName] === undefined) {
      gameRanking[team1.teamName] = team1;
    } else { // cumulate points from games
      let temp1 = team1.teamPoints;
      (gameRanking[team1.teamName]).teamPoints += temp1;
    }
    
    if (gameRanking[team2.teamName] === undefined) {
      gameRanking[team2.teamName] = team2;
    } else { // cumulate points from games
      let temp2 = team2.teamPoints;
      (gameRanking[team2.teamName]).teamPoints += temp2;
    }
    
  })
  return gameRanking;
}

function groupsConstructor(teamRanking) {
  const ranking = Object.values(teamRanking);
  let teamsOrder = {};
  ranking.forEach(function(team) {
    if (teamsOrder[team.teamPoints] === undefined) {
      teamsOrder[team.teamPoints] = [team.teamName];
    } else {
      let temp = teamsOrder[team.teamPoints]; // temp variable to have some reference to the array
      let newArray = temp.concat(team.teamName)
      teamsOrder[team.teamPoints] = newArray;
    }  
  });
  return teamsOrder;
}

function groupsSortPrint(groups) {
  let sortedPointsArray = (Object.keys(groups)).sort().reverse();
  let position = 1;
  sortedPointsArray.forEach(function(point) {
    let group = (groups[point]).sort();
    group.forEach(function(team) {
      console.log(position + '. ' + team + ', ' + pointsToString(point));
    });
    position = position + group.length;
  })
}

function pointsToString(point) {
  if (point == 1) {
    point = '1 pt';
  } else {
    point = point + ' pts';
  }
  return point;
}