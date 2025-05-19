import { getJson } from '../process/utils.js';
import fs from 'fs';

// Function to get lawmaker by name or key
const generateAbsenceReport = (targetLawmaker) => {
  // Load all the data we need
  const bills = getJson('./src/data/bills.json');
  const lawmakers = getJson('./src/data/lawmakers.json');
  
  // Find our lawmaker
  const lawmaker = lawmakers.find(l => 
    l.name === targetLawmaker || 
    l.key === targetLawmaker.toLowerCase().replace(/\s/g, '-')
  );
  
  if (!lawmaker) {
    console.error(`Lawmaker "${targetLawmaker}" not found.`);
    return;
  }

  console.log(`\nGenerating absence report for ${lawmaker.name} (${lawmaker.party}-${lawmaker.districtNum})\n`);
  console.log(`Total recorded absences: ${lawmaker.votingSummary?.numVotesNotPresent || 'N/A'}\n`);
  
  const absences = [];
  const missedVotesByDay = {};
  
  // Process each bill to find votes the lawmaker missed
  let totalProcessed = 0;
  let floorVotes = 0;
  let committeeVotes = 0;

  bills.forEach(bill => {
    // Load actions for this bill
    try {
      const billId = bill.identifier.replace(' ', '-');
      const actionsPath = `./inputs/bills/${billId}/${billId}-actions.json`;
      
      if (!fs.existsSync(actionsPath)) return;
      
      const actions = getJson(actionsPath);
      
      actions.forEach(action => {
        if (!action.vote) return;
        
        const vote = action.vote;
        
        totalProcessed++;
        
        // Track vote types for diagnostic purposes
        if (vote.type === 'floor') {
          floorVotes++;
        } else if (vote.type === 'committee') {
          committeeVotes++;
        }
        
        // Simple filter: only include floor votes
        if (vote.type !== 'floor') return;
        
        // Check if lawmaker was absent or excused
        const lawmakerVote = vote.votes.find(v => v.name === lawmaker.name);
        if (!lawmakerVote) return; // Lawmaker wasn't even eligible to vote
        
        if (lawmakerVote.option === 'A' || lawmakerVote.option === 'E') {
          const date = new Date(vote.date).toISOString().split('T')[0];
          
          // Add to our tracking
          const absence = {
            date,
            bill: bill.identifier,
            title: bill.title.substring(0, 80) + (bill.title.length > 80 ? '...' : ''),
            description: action.description || "Unknown action",
            location: vote.voteChamber === 'house' ? 'House' : (vote.voteChamber === 'senate' ? 'Senate' : vote.voteChamber),
            motion: vote.motion || action.description || "Unknown motion",
            voteType: lawmakerVote.option === 'A' ? 'Absent' : 'Excused',
          };
          
          absences.push(absence);
          
          // Group by date
          if (!missedVotesByDay[date]) {
            missedVotesByDay[date] = [];
          }
          missedVotesByDay[date].push(absence);
        }
      });
    } catch (err) {
      console.error(`Error processing bill ${bill.identifier}:`, err);
    }
  });

  // Generate report
  console.log(`Processed ${totalProcessed} total votes (${floorVotes} floor votes, ${committeeVotes} committee votes)\n`);
  
  if (absences.length === 0) {
    console.log('No floor vote absences found.');
    return;
  }

  console.log(`Found ${absences.length} missed floor votes across ${Object.keys(missedVotesByDay).length} days\n`);

  console.log(`Found ${absences.length} missed votes across ${Object.keys(missedVotesByDay).length} days\n`);
  
  // Summary by day
  console.log('SUMMARY BY DAY:');
  console.log('==============');
  
  const sortedDates = Object.keys(missedVotesByDay).sort();
  sortedDates.forEach(date => {
    const dayMisses = missedVotesByDay[date];
    console.log(`${date}: ${dayMisses.length} votes missed (${dayMisses.filter(m => m.voteType === 'Absent').length} absent, ${dayMisses.filter(m => m.voteType === 'Excused').length} excused)`);
  });
  
  // Detailed report
  console.log('\nDETAILED REPORT:');
  console.log('===============');
  
  sortedDates.forEach(date => {
    console.log(`\n${date} - ${missedVotesByDay[date].length} votes missed:`);
    
//     missedVotesByDay[date].forEach((absence, i) => {
//       console.log(`  ${i+1}. ${absence.bill} - ${absence.motion} (${absence.voteType})`);
//       console.log(`     "${absence.title}"`);
//       console.log(`     Location: ${absence.location}, Vote result: ${absence.voteCount}`);
//     });
  });
  
  // Save to file
  const reportData = {
    lawmaker: lawmaker.name,
    district: lawmaker.district,
    party: lawmaker.party, 
    totalMissedVotes: absences.length,
    daysMissed: Object.keys(missedVotesByDay).length,
    missedVotesByDay,
    generatedAt: new Date().toISOString()
  };
  
  const outputDir = './reports';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const filename = `${outputDir}/${lawmaker.name.replace(/\s/g, '-')}-absence-report.json`;
  fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
  
  console.log(`\nReport saved to ${filename}`);
  
  const sortedAbsences = absences.sort((a, b) => {
  // Sort by date first
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  
  // If dates are the same, sort by bill identifier
  if (a.bill < b.bill) return -1;
  if (a.bill > b.bill) return 1;
  
  return 0;
});

// Then use the sorted absences for the CSV
const csvRows = [
  ['Date', 'Bill', 'Motion', 'Location', 'Type', 'Bill Title']
];

// Use sortedAbsences instead of absences
sortedAbsences.forEach(absence => {
  csvRows.push([
    absence.date,
    absence.bill,
    absence.motion,
    absence.location,
    absence.voteType,
    // absence.voteCount,
    absence.title
  ]);
});
  
  const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const csvFilename = `${outputDir}/${lawmaker.name.replace(/\s/g, '-')}-absence-report.csv`;
  fs.writeFileSync(csvFilename, csvContent);
  
  console.log(`CSV report saved to ${csvFilename}`);
};

// Check for command line argument
const targetLawmaker = process.argv[2];
if (!targetLawmaker) {
  console.log('Usage: node scripts/generate-absence-report.js "Lawmaker Name"');
  process.exit(1);
}

generateAbsenceReport(targetLawmaker);