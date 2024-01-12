const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const Logger = require('Logger');
const winston = require('winston');

// Create a logger with a console transport
const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});


app.use(bodyParser.json());


// Function to compute the name number.
function computeNameNumber(name) {
    let sum = 0;


    // Loop through each letter in the name.
    for (let i = 0; i < name.length; i++) {
        const letter = name[i].toUpperCase();
        sum += letterMapping[letter] || 0; // Add the corresponding number, or 0 if the letter is not in the mapping.
    }


    // Reduce the sum to a single digit.
    while (sum > 9) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }


    return sum;
}



// Function to compute astrological sign.
function computeAstrologicalSign(day, month) {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
}




// Function to compute the Mulank
function computeMulank(dob) {
    // Assuming dob is in the format DD/MM/YYYY, split to get the day
    const day = dob.split('-')[0];
    // Call the sumDigits function to keep adding digits until a single digit is obtained
    return sumDigits(day);
}


// Function to compute the Bhagyank
function computeBhagyank(dob) {
    // Remove the '/' from the dob and join all numbers
    const allNumbers = dob.split('-').join('');
    // Call the sumDigits function to keep adding digits until a single digit is obtained
    return sumDigits(allNumbers);
}


// Helper function to keep summing digits until a single digit number is obtained
function sumDigits(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    }
    return num;
}


function formatDate(date) {
    // Use Utilities.formatDate to format the date as a string in the desired format
    return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'dd/MM/yyyy');
}




// Define the mapping of numbers to planets.
const planetMapping = {
    1: 'Sun',
    2: 'Moon',
    3: 'Jupiter',
    4: 'Rahu',
    5: 'Mercury',
    6: 'Venus',
    7: 'Ketu',
    8: 'Saturn',
    9: 'Mars'
};




// Function to get planet based on the number.
function getPlanet(number) {
    number = parseInt(number, 10);
    return planetMapping[number];
}


// Define the mapping of letters to numbers.
const letterMapping = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'S': 3, 'C': 3, 'G': 3, 'L': 3,
    'M': 4, 'D': 4, 'T': 4,
    'N': 5, 'E': 5, 'H': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
};




function computeKuaNumber(year, gender) {

    // Convert year to a string and sum its digits.
    let sum = sumDigits(year);

    // Ensure the sum is a single digit.
    while (sum > 9) {
        sum = sumDigits(sum);
    }

    var kuaNumber = 0;
    const cleanedGender = gender.trim().toLowerCase();

    if (cleanedGender === 'male') {
        kuaNumber = 11 - sum;
    } else if (cleanedGender === 'female') {
        kuaNumber = 4 + sum;
    } else {
        return null; // Handle the case of an invalid gender.
    }

    // If Kua Number is greater than 9, sum its digits.
    while (kuaNumber > 9) {
        kuaNumber = sumDigits(kuaNumber);
    }


    // Trim the gender string and compare in a case-insensitive manner
    if (kuaNumber === 5) {
        kuaNumber = gender.trim().toLowerCase() === 'male' ? 2 : 8;
    }

    if (kuaNumber === 0) {
        return null; // Handle the case where the final kuaNumber is 0.
    }
    return kuaNumber;
}


// Mapping of enemy numbers for each number from 1 to 9.
const enemyNumberMapping = {
    1: [4, 7, 8],
    2: [6, 7, 4, 8, 9],
    3: [4, 7, 8, 9, 6],
    4: [3, 2, 9],
    5: [4, 7, 8, 9],
    6: [2, 3, 4, 8, 9],
    7: [2, 8, 9],
    8: [1, 2, 9],
    9: [2, 4, 6, 7, 8, 9]
};


// Function to compute lucky numbers based on mulank and bhagyank.
function computeLuckyNumbers(number_m, number_b) {
    let totalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // All numbers from 1 to 9.
    number_m = parseInt(number_m, 10);
    number_b = parseInt(number_b, 10);
    

    // Get the enemy numbers for mulank and bhagyank.
    const mulankEnemies = enemyNumberMapping[number_m];
    const bhagyankEnemies = enemyNumberMapping[number_b];

    if (!Array.isArray(mulankEnemies) || !Array.isArray(bhagyankEnemies)) {
        // handle the error, e.g., by logging an error message and returning from the function
        return;
    }


    // Combine enemy numbers.
    const allEnemies = [...new Set([...mulankEnemies, ...bhagyankEnemies])]; // Remove duplicates by converting to a Set.

    // Filter out the enemy numbers from the total numbers to get the lucky numbers.
    const luckyNumbers = totalNumbers.filter(number => !allEnemies.includes(number));

    return { luckyNumbers, allEnemies };
}


function computeLuckyColours(number_m) {
    number_m = parseInt(number_m, 10);
    colour = {
        1: 'Red colour',
        2: 'Pearl white',
        3: 'Yellow , Orange , Brown',
        4: 'Blue , Grey ',
        5: 'Green',
        6: 'Multicolor,White',
        7: 'Grey',
        8: 'Blue',
        9: 'Red , Yellow '
    }
    return colour[number_m];
}

function computeMantra(number_m) {
    number_m = parseInt(number_m, 10);

    mantra = {
        1: "Om Hram Hreem Hroum Sah Suryaya Namaha",
        2: "Om Shram Shreem Shroum Sah Chandraya Namaha",
        3: "Om Gram Greem Groum Sah Gurave Namaha",
        4: "Om Bhram Bhreem Bhroum Sah Rahave Namaha",
        5: "Om Bram Breem Broum Sah Budhaya Namaha",
        6: "Om Dram Dreem Droum Sah Shukraya Namaha",
        7: "Om Shram Shreem Shroum Sah Ketave Namaha",
        8: "Om Pram Preem Proum Sah Shanaischaraya Namaha",
        9: "Om Kram Kreem Kroum Sah Bhaumaya Namaha",

    }

    return mantra[number_m];
}

function computeYantra(number_m) {
    number_m = parseInt(number_m, 10);
    yantra = {
        1: 'Surya Yantra',
        2: 'Chandra Yantra',
        3: 'Guru Yantra',
        4: 'Rahu Yantra',
        5: 'Budha Yantra',
        6: 'Shukra Yantra',
        7: 'Ketu Yantra',
        8: 'Shani Yantra',
        9: 'Mangal Yantra',
    }
    return yantra[number_m];
}

function computeLuckyYears(number_m) {
    number_m = parseInt(number_m, 10);
    year = {
        1: '10th ,19th, 28th,37th,46th,55th,64th,73rd',
        2: '11th,20th,29th,38th,47th,56th,65th',
        3: '12th,21th,30th,39th,48th,57th,66th',
        4: '13th,22th,31st,40th,49th,58th,67th',
        5: '14th,23rd,32nd,41th,50th,59,68th',
        6: '15th,24th,33rd,42nd,51st,60th,69th',
        7: '16th,25th,34th,43rd,52nd,61st,70th',
        8: '17th,26th,35th,44th,53rd,62nd,71st',
        9: '18th,27th,36th,45th,54th,63rd,72nd',
    }

    return year[number_m];
}

function computeSuccessNumber(date, month) {
    sum_date = sumDigits(date);
    sum_month = sumDigits(month);
    successnumber = sum_date + sum_month;
    successnumber = sumDigits(successnumber);
    return successnumber;

}

function computeLuckyDates(number_m) {
    number_m = parseInt(number_m, 10);
    dates = {
        1: "10th ,15th ,19th,24th of any month",
        2: "2nd , 11th, 20th,21st , 29th of any month",
        3: "3rd ,12th,14th,21st,28th of any month",
        4: "3rd,12th,21st,22nd,23rd of any month",
        5: "5th,11th,21st,23rd of any month",
        6: "6th,15th,23rd,24th of any month",
        7: "7th,16th,25th,28th of any month",
        8: "3rd ,5th,14th,21st,23rd of any month",
        9: "1st,9th,10th,19th,21st,27th,28th of any month",
    }
    return dates[number_m]

}

function computeRudraksh(number_b) {
    number_m = parseInt(number_b, 10);
    rudraksh = {
        1: '1 Mukhi',
        2: '2 Mukhi',
        3: '5 Mukhi',
        4: 'Ganesh Rudraksha',
        5: '4 Mukhi',
        6: '6 Mukhi',
        7: 'Ganesh Rudraksha',
        8: '7 Mukhi',
        9: '3 Mukhi',
    }

    return rudraksh[number_b];
}

function createCustomGrid(birthDate, number_m, number_b) {
    // Logging the birthDate
    console.log('Birth Date:', birthDate);

    number_m = parseInt(number_m, 10);
    number_b = parseInt(number_b, 10);
    let loShuSquare = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ];

    let birthDateDigits = birthDate.replace(/\D/g, '').split('').map(Number);

    let counts = Array(10).fill(0);
    for (let digit of birthDateDigits) {
        counts[digit]++;
    }

    // Check birthDate before incrementing moolank
    let birthDay = parseInt(birthDate.split('/')[0], 10);
    if (birthDay > 9 && birthDay % 10 !== 0) {
        //Logger.log('moolank', moolank);
        counts[number_m]++;
    }

    counts[number_b]++;


    let grid = loShuSquare.map(row =>
        row.map(num =>
            counts[num] > 0 ? Array(counts[num]).fill(num).join('') : ''
        )
    );

    return grid;
}



function getLuckyBracelet(moolank, bhagyank) {
    const bhagyankBracelets = [
        'Tiger Eye', // Bhagyank 1
        'Green Zade', // Bhagyank 2
        'Azurite', // Bhagyank 3
        'Rock Crystal', // Bhagyank 4
        'Turquoise', // Bhagyank 5
        'Rhodonite', // Bhagyank 6
        'Kambaba Jasper', // Bhagyank 7
        'Sodalite', // Bhagyank 8
        'Bloodstone' // Bhagyank 9
    ];

    const moolankBracelets = [
        'Sun Stone Bracelet', // Moolank 1
        'Mother of Pearl Bracelet', // Moolank 2
        'Dragon Vein', // Moolank 3
        'Golden Obsidian Bracelet', // Moolank 4
        'Green Aventurian', // Moolank 5
        'Rose Quartz', // Moolank 6
        'Cats Eye', // Moolank 7
        'Amythyst', // Moolank 8
        'Pyrite' // Moolank 9
    ];

    // Ensure moolank and bhagyank are in correct range
    if (moolank < 1 || moolank > 9 || bhagyank < 1 || bhagyank > 9) {
        throw new Error('Invalid moolank or bhagyank. They should be between 1 and 9.');
    }

    // Adjusting the index to match the array index (0-indexed)
    const luckyBhagyankBracelet = bhagyankBracelets[bhagyank - 1];
    const luckyMoolankBracelet = moolankBracelets[moolank - 1];

    return {
        moolankBracelet: luckyMoolankBracelet,
        bhagyankBracelet: luckyBhagyankBracelet,
    };
}

compatibility_data_percentage = {
    1: {
        1: 91,
        2: 91,
        3: 83,
        4: 71,
        5: 83,
        6: 63,
        7: 63,
        8: 11,
        9: 91
    },
    2: {
        1: 83,
        2: 44,
        3: 71,
        4: 31,
        5: 83,
        6: 44,
        7: 31,
        8: 22,
        9: 31
    },
    3: {
        1: 83,
        2: 63,
        3: 71,
        4: 63,
        5: 83,
        6: 22,
        7: 83,
        8: 71,
        9: 71
    },
    4: {
        1: 63,
        2: 71,
        3: 71,
        4: 22,
        5: 63,
        6: 71,
        7: 83,
        8: 22,
        9: 22
    },
    5: {
        1: 83,
        2: 63,
        3: 71,
        4: 63,
        5: 71,
        6: 91,
        7: 83,
        8: 63,
        9: 83
    },
    6: {
        1: 91,
        2: 71,
        3: 31,
        4: 71,
        5: 91,
        6: 71,
        7: 83,
        8: 71,
        9: 63
    },
    7: {
        1: 63,
        2: 31,
        3: 83,
        4: 83,
        5: 63,
        6: 83,
        7: 44,
        8: 53,
        9: 71
    },
    8: {
        1: 22,
        2: 31,
        3: 53,
        4: 22,
        5: 63,
        6: 53,
        7: 44,
        8: 22,
        9: 44
    },
    9: {
        1: 83,
        2: 31,
        3: 63,
        4: 31,
        5: 83,
        6: 71,
        7: 63,
        8: 63,
        9: 53
    }
}






function fetchMulankBhagyankDescription(mulank, bhagyank) {
    bhagyank = parseInt(bhagyank, 10);
    mulank = parseInt(mulank, 10);


    var compatibilityPercent;


    if (compatibility_data_percentage[mulank]) {
        compatibilityPercent = compatibility_data_percentage[mulank][bhagyank];
    } else {
        compatibilityPercent = undefined;
    }
    

    if (compatibilityPercent === undefined) {
        return "Combination not found.";
    }


    // Assuming image names in Google Drive are named according to the percentages, e.g., "91.png"
    var imageName = compatibilityPercent + ".png";


    // Insert the image in the doc by replacing a placeholder (you can choose the placeholder)
    //insertImageByPlaceholder(body, "percentage", imageName, "{INSERT_IMAGE}", 400, 400); // You can adjust the


    var key = mulank + "," + bhagyank;
    //return descriptions[key] || "Combination not found.";
}

function getSoulUrgeNumberData(name) {
    let total = 0;


    // Iterate through each character in the name.
    for (const char of name.toUpperCase()) {
        // Check if the character is a vowel and exists in the letterMapping.
        if ("AEIOU".includes(char) && letterMapping[char]) {
            total += letterMapping[char];
        }
    }


    // Sum the digits of the total to obtain a single-digit soul urge number.
    while (total > 9) {
        total = String(total).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }


    // Return the data associated with the Soul Urge Number.
    return soulUrgeData[total];
}


const personalityNumberData = {
    1: "Independent and Innovative",
    2: "Diplomatic and Cooperative",
    3: "Creative and Expressive",
    4: "Disciplined and Practical",
    5: "Adventurous and Dynamic",
    6: "Nurturing and Supportive",
    7: "Analytical and Introspective",
    8: "Ambitious and Goal-Oriented",
    9: "Compassionate and Humanitarian"
};

function calculatePersonalityNumber(name) {
    let sum = 0;


    // Iterate through each letter in the name.
    for (let char of name.toUpperCase()) {
        // Check if the character is a consonant.
        if ("AEIOU".indexOf(char) === -1 && letterMapping[char] !== undefined) {
            sum += letterMapping[char];
        }
    }


    // Reduce the sum to a single digit.
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = Array.from(String(sum), Number).reduce((acc, val) => acc + val, 0);
    }


    // Return the meaning of the personality number.
    return {
        number: sum,
        meaning: personalityNumberData[sum]
    };
}




function calculatePersonalityNumberHindi(name) {
    let sum = 0;


    // Iterate through each letter in the name.
    for (let char of name.toUpperCase()) {
        // Check if the character is a consonant.
        if ("AEIOU".indexOf(char) === -1 && letterMapping[char] !== undefined) {
            sum += letterMapping[char];
        }
    }


    // Reduce the sum to a single digit.
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = Array.from(String(sum), Number).reduce((acc, val) => acc + val, 0);
    }


    return {
        number: sum,
        meaning: personalityNumberData[sum]
    };
}

const colorData = {
    1: "Red",
    2: "Orange",
    3: "Yellow",
    4: "Green",
    5: "Blue",
    6: "Indigo",
    7: "Violet",
    8: "Pink",
    9: "White"
};

function getFavorableColor(number_m) {
    number_m = parseInt(number_m, 10);


    return colorData[number_m];
}

profession_career_data = {
    1: "Innovator or Entrepreneur",
    2: "Diplomat or Mediator",
    3: "Artist or Creative Professional",
    4: "Engineer or Scientist",
    5: "Explorer or Traveler",
    6: "Counselor or Caregiver",
    7: "Researcher or Analyst",
    8: "Executive or Leader",
    9: "Humanitarian or Social Worker"
};

function getProfessional(number_m, number_b) {
    const professions = [];

    // Loop through each digit in number_m and number_b
    [number_m, number_b].forEach((num) => {
        // Ensure num is a single digit
        num = sumDigits(num);
        // Get the profession for the digit
        const profession = profession_career_data[num];
        if (profession) {
            professions.push(profession);
        }
    });

    return professions.join(', ');
}


const grid_data_result = {
    1: {
        0: "Number 1 is missing, indicating a need for independence and leadership.",
        1: "Number 1 appears once, signifying individuality and initiative.",
        2: "Number 1 appears twice, suggesting a strong desire for leadership and originality.",
        // Add more data as needed
    },
    2: {
        0: "Number 2 is missing, implying a lack of balance and cooperation.",
        1: "Number 2 appears once, representing cooperation and diplomacy.",
        2: "Number 2 appears twice, highlighting a strong emphasis on partnership and harmony.",
        // Add more data as needed
    },
    3: {
        0: "Number 3 is missing, indicating potential creativity and self-expression.",
        1: "Number 3 appears once, suggesting creativity and communication.",
        2: "Number 3 appears twice, emphasizing a strong creative influence.",
        // Add more data as needed
    },
    4: {
        0: "Number 4 is missing, signaling a lack of stability and structure.",
        1: "Number 4 appears once, representing stability and practicality.",
        2: "Number 4 appears twice, indicating a strong foundation and order.",
        // Add more data as needed
    },
    5: {
        0: "Number 5 is missing, suggesting a need for freedom and change.",
        1: "Number 5 appears once, signifying adaptability and versatility.",
        2: "Number 5 appears twice, highlighting a strong desire for freedom and adventure.",
        // Add more data as needed
    },
    6: {
        0: "Number 6 is missing, indicating a potential imbalance in relationships.",
        1: "Number 6 appears once, representing harmony and responsibility.",
        2: "Number 6 appears twice, suggesting a strong emphasis on family and community.",
        // Add more data as needed
    },
    7: {
        0: "Number 7 is missing, implying a lack of introspection and spiritual awareness.",
        1: "Number 7 appears once, signifying introspection and intuition.",
        2: "Number 7 appears twice, highlighting a strong connection to spirituality.",
        // Add more data as needed
    },
    8: {
        0: "Number 8 is missing, indicating potential challenges in achieving material success.",
        1: "Number 8 appears once, representing ambition and success.",
        2: "Number 8 appears twice, suggesting a strong drive for material abundance.",
        // Add more data as needed
    },
    9: {
        0: "Number 9 is missing, suggesting a potential lack of compassion and universal love.",
        1: "Number 9 appears once, signifying compassion and humanitarianism.",
        2: "Number 9 appears twice, emphasizing a strong connection to universal love.",
        // Add more data as needed
    },
};


function analyzeLoShuGrid(loShuSquare) {
    let results = [];
    let counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };


    // Count occurrences of each number in the grid
    loShuSquare.forEach(row => {
        row.forEach(item => {
            if (item) {
                let numberAsString = item.toString();
                let number = parseInt(numberAsString[0]);
                let repetitions = numberAsString.length;
                counts[number] += repetitions;
            }
        });
    });


    // Analyze the counts and fetch the data
    for (let num = 1; num <= 9; num++) {
        if (counts[num] > 0) {
            let heading = `${num} is present ${counts[num]} times:\n\n`;
            results.push(heading);
            if (grid_data_result[num][counts[num]]) {
                results.push(grid_data_result[num][counts[num]] + "\n\n");
            } else {
                results.push(`Data for number ${num} with count ${counts[num]} is not available.\n\n`);
            }
        }
    }
    const data_for_loshu = [results.join(''), counts]; // Join results into a single string
    return data_for_loshu;
}



function getMissingNumbersData(counts) {
    let missingNumbersData = [];
    for (let num = 1; num <= 9; num++) {
        if (counts[num] === 0) {
            missingNumbersData.push(grid_data_result[num][0]); // fetch data for missing number
        }
    }


    return missingNumbersData;
}


function generateDisplayData(element) {
    return `${element}:\n- Position: ${elementDescriptions[element]["Position"]}\n- Characteristics: ${elementDescriptions[element]["Characteristics"]}\n`;
}


function get_fengshui_directions(loshu_grid_data_count) {
    const elementNumbers = {
        "Water": [1],
        "Wood": [3, 4],
        "Fire": [9],
        "Earth": [2, 5, 8],
        "Metal": [6, 7]
    };


    let results = [];


    for (let element in elementNumbers) {
        if (elementNumbers[element].some(num => loshu_grid_data_count[num] && loshu_grid_data_count[num] > 0)) {
            results.push(generateDisplayData(element));
        }
    }


    if (results.length === 0) {
        return 'No dominant element is present in the grid.';
    }


    return results.join('\n');
}




function lucky_direction(year, gender) {
    const cleanedGender = gender.trim().toLowerCase();
    sum = sumDigits(year)
    if (cleanedGender === 'male') {
        sum = 11 - sum;
        if (sum === 5) {
            sum = 2
        }
    }
    else {
        sum = 4 + sum
        if (sum === 5) {
            sum = 8
        }
    }
    return sum;
}


function getBestDirections(year, gender) {
    const bestDirections = {
        1: { Success: "South East", Health: "East", Relationships: "South", Wisdom: "North" },
        2: { Success: "North East", Health: "West", Relationships: "North West", Wisdom: "South West" },
        3: { Success: "South", Health: "North", Relationships: "South East", Wisdom: "East" },
        4: { Success: "North", Health: "South", Relationships: "East", Wisdom: "South East" },
        6: { Success: "West", Health: "North East", Relationships: "South West", Wisdom: "North West" },
        7: { Success: "North West", Health: "South West", Relationships: "North East", Wisdom: "West" },
        8: { Success: "Southwest", Health: "Northwest", Relationships: "West", Wisdom: "Northeast" },
        9: { Success: "East", Health: "South East", Relationships: "North", Wisdom: "South" }
    };


    let sum = sumDigits(year);
    let kuaNumber;


    const cleanedGender = gender.trim().toLowerCase();
    if (cleanedGender === 'male') {
        kuaNumber = sumDigits(11 - sum);
        if (kuaNumber === 5) {
            kuaNumber = 2;
        }
    } else if (cleanedGender === 'female') {
        kuaNumber = sumDigits(4 + sum);
        if (kuaNumber === 5) {
            kuaNumber = 8;
        }
    }
    const directions = bestDirections[kuaNumber];


    return `Success: ${directions.Success},
Health: ${directions.Health},
Relationships: ${directions.Relationships},
Wisdom: ${directions.Wisdom}`;
}

const kuaMapping = {
    1: {
        Positive: "Leadership, Independence, Ambition",
        Negative: "Stubbornness, Arrogance",
        Tips: "Cultivate flexibility and teamwork"
    },
    2: {
        Positive: "Cooperation, Diplomacy, Harmony",
        Negative: "Indecisiveness, Over-sensitivity",
        Tips: "Embrace decisiveness and assertiveness"
    },
    3: {
        Positive: "Creativity, Sociability, Optimism",
        Negative: "Exaggeration, Scattered Energy",
        Tips: "Focus on practicality and discipline"
    },
    4: {
        Positive: "Stability, Organization, Practicality",
        Negative: "Rigidity, Resistance to Change",
        Tips: "Embrace change with an open mind"
    },
    5: {
        Positive: "Adaptability, Versatility, Curiosity",
        Negative: "Restlessness, Impulsiveness",
        Tips: "Cultivate patience and focus"
    },
    6: {
        Positive: "Responsibility, Service, Nurturing",
        Negative: "Overly critical, Worry-prone",
        Tips: "Practice self-care and balance"
    },
    7: {
        Positive: "Spirituality, Intuition, Analysis",
        Negative: "Overthinking, Detachment",
        Tips: "Cultivate mindfulness and groundedness"
    },
    8: {
        Positive: "Achievement, Abundance, Authority",
        Negative: "Workaholism, Materialism",
        Tips: "Balance work and personal life"
    },
    9: {
        Positive: "Compassion, Idealism, Universal Love",
        Negative: "Impracticality, Daydreaming",
        Tips: "Balance dreams with practical actions"
    }
};


function calculateKuaSum(dd, mm, year) {
    let sum = dd + mm + Array.from(year.toString()).reduce((a, b) => a + parseInt(b), 0);
    return sum;
}

function getKuaData(dd, mm) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let results = [];


    for (let offset = 1; offset <= 12; offset++) {
        let monthIndex = (currentMonth + offset) % 12;
        let monthName = monthNames[monthIndex];
        let year = currentYear + Math.floor((currentMonth + offset) / 12);


        let sum = calculateKuaSum(dd, monthIndex + 1, year);
        let kua__Number = sum % 9 || 9;
        let kuaData = kuaMapping[kua__Number];


        let description = {
            heading: `${monthName} ${year}`,
            positive: kuaData.Positive,
            negative: kuaData.Negative,
            tips: kuaData.Tips
        };


        results.push(description);
    }


    return results;
}




function getBhagyankCycle(bhagyank, cycleNumber) {
    let total = 36 - bhagyank;
    switch (cycleNumber) {
        case 1:
            return [1, 0, total];
        case 2:
            return [2, total + 1, total + 9];
        case 3:
            return [3, total + 10, total + 18];
        case 4:
            return [4, total + 19, 'onwards'];
    }
}


function getChallengeNumber(cycle, day, month, year) {
    let num;
    switch (cycle) {
        case 1: num = month + day; break;
        case 2: num = day + year; break;
        case 3: num = (month + day) + (day + year); break;
        case 4: num = month + year; break;
    }
    return sumDigits(num);
}


const challenge_data = {
    1: {
        1: "Challenge 1, Cycle 1: This cycle is associated with new beginnings and independence. Embrace change and take on new challenges with confidence.",
        2: "Challenge 1, Cycle 2: Focus on partnerships and collaborations during this cycle. Teamwork and cooperation will lead to success.",
    },
    2: {
        1: "Challenge 2, Cycle 1: Develop patience and diplomacy in your interactions. This cycle emphasizes relationships and sensitivity.",
        2: "Challenge 2, Cycle 2: Deepen your emotional connections and understanding of others. Compassion and cooperation are key.",
    },
    3: {
        1: "Challenge 3, Cycle 1: Express your creativity and communicate openly. This cycle encourages self-expression and social interactions.",
        2: "Challenge 3, Cycle 2: Expand your horizons and pursue opportunities for growth. Travel and learning play a significant role.",
    },
    4: {
        1: "Challenge 4, Cycle 1: Focus on building a solid foundation. Hard work and discipline are essential during this cycle.",
        2: "Challenge 4, Cycle 2: Strengthen your organizational skills and attention to detail. Practicality is key for success.",
    },
    5: {
        1: "Challenge 5, Cycle 1: Embrace change and adaptability. This cycle encourages freedom and exploration.",
        2: "Challenge 5, Cycle 2: Emphasize variety and diversity in your experiences. Adventure and curiosity lead to growth.",
    },
    6: {
        1: "Challenge 6, Cycle 1: Focus on family and relationships. Nurturing and responsibility are key themes in this cycle.",
        2: "Challenge 6, Cycle 2: Strengthen your sense of community and service. Compassion and empathy lead to fulfillment.",
    },
    7: {
        1: "Challenge 7, Cycle 1: Dive into introspection and spiritual exploration. Seek inner wisdom and understanding.",
        2: "Challenge 7, Cycle 2: Continue your spiritual journey and embrace intellectual pursuits. Wisdom and intuition guide you.",
    },
    8: {
        1: "Challenge 8, Cycle 1: Focus on financial and material aspects. Hard work and perseverance lead to prosperity.",
        2: "Challenge 8, Cycle 2: Strengthen your leadership skills and organizational abilities. Success comes through discipline.",
    },
    9: {
        1: "Challenge 9, Cycle 1: Embrace humanitarian efforts and global perspectives. Make a positive impact on the world.",
        2: "Challenge 9, Cycle 2: Focus on personal growth and self-realization. Reflect on your journey and pursue higher knowledge.",
    },
};


function getChallengeData(day, month, year, bhagyank) {
    let results = [];
    for (let i = 1; i <= 4; i++) {
        let [cycle, start, end] = getBhagyankCycle(bhagyank, i);
        let challengeNumber = getChallengeNumber(cycle, day, month, year);


        // Construct the desired formatted output
        let formattedDescription = `Challenge Cycle ${cycle}\n`;
        formattedDescription += `Range (in years): ${start}-${end}\n`;
        formattedDescription += `Challenge Number is: ${challengeNumber}\n\n`;
        formattedDescription += `${challenge_data[challengeNumber][cycle]}\n\n`;


        results.push(formattedDescription);
    }
    return results;
}

// Function to get lucky bank names for a given Mulani
function getLuckyBanksForMulani(mulani) {
    mulani = parseInt(mulani, 10);
    const luckyBanks = mulaniToBankNameMap[mulani] || [];
    if (luckyBanks.length === 0) {
        console.error(`Invalid mulani or no lucky bank names found for mulani: ${mulani}`);
    }
    return luckyBanks;
}

function computeYantra(number_m) {
    number_m = parseInt(number_m, 10);
    yantra = {
        1: 'Surya Yantra',
        2: 'Chandra Yantra',
        3: 'Guru Yantra',
        4: 'Rahu Yantra',
        5: 'Budha Yantra',
        6: 'Shukra Yantra',
        7: 'Ketu Yantra',
        8: 'Shani Yantra',
        9: 'Mangal Yantra',
    }
    return yantra[number_m];
}

function computeYantra(number_m) {
    number_m = parseInt(number_m, 10);
    yantra = {
        1: 'Surya Yantra',
        2: 'Chandra Yantra',
        3: 'Guru Yantra',
        4: 'Rahu Yantra',
        5: 'Budha Yantra',
        6: 'Shukra Yantra',
        7: 'Ketu Yantra',
        8: 'Shani Yantra',
        9: 'Mangal Yantra',
    }
    return yantra[number_m];
}

function computeYantra(number_m) {
    number_m = parseInt(number_m, 10);
    yantra = {
        1: 'Surya Yantra',
        2: 'Chandra Yantra',
        3: 'Guru Yantra',
        4: 'Rahu Yantra',
        5: 'Budha Yantra',
        6: 'Shukra Yantra',
        7: 'Ketu Yantra',
        8: 'Shani Yantra',
        9: 'Mangal Yantra',
    }
    return yantra[number_m];
}



app.post('/calculate', (req, res) => {

    const { name, dob, gender } = req.body;

    const [day, month,year] = dob.split('-').map(Number);


    
    try {

        let loShuSquare = [
            [4, 9, 2],
            [3, 5, 7],
            [8, 1, 6]
        ];

        const nameNumber = computeNameNumber(name);
        const AstronomicalSign = computeAstrologicalSign(day, month);
        const number_m = computeMulank(dob);
        const number_b = computeBhagyank(dob);
        const kuaNumber = computeKuaNumber(year, gender);
        const kuaData = getKuaData(day, month)
        const LuckyNumber = computeLuckyNumbers(number_m, number_b);
        const LuckyColours = computeLuckyColours(number_m);
        const Mantra = computeMantra(number_m);
        const Yantra = computeYantra(number_m);
        const LuckyYear = computeLuckyYears(number_m);
        const SuccessNumber = computeSuccessNumber(day, month);
        const LuckyDates = computeLuckyDates(number_m);
        const Rudraksha = computeRudraksh(number_b);
        const Grid = createCustomGrid(dob, number_m, number_b);
        const LuckyBracelet = getLuckyBracelet(number_m, number_b);
        const MulankBhagyankDescription = fetchMulankBhagyankDescription(number_m, number_b);
        const PersonalityNumber = calculatePersonalityNumber(name);
        const PersonalityNumberHindi = calculatePersonalityNumberHindi(name);
        const FavorableColor = getFavorableColor(number_m);
        const Professional = getProfessional(number_m, number_b);
        const LoShuGrid = analyzeLoShuGrid(loShuSquare);
        //const DisplayData = generateDisplayData(element);
        //const FengshuiDirections = get_fengshui_directions(loshu_grid_data_count);
        const LuckyDirection = lucky_direction(year, gender);
        const BestDirections = getBestDirections(year, gender);
        const KuaSum = calculateKuaSum(day, month, year);
        // //const BhagyankCycle = getBhagyankCycle(number_b, cycleNumber);
        // //const ChallengeNumber = getChallengeNumber(cycle, dob.day, dob.month, dob.year);
        const ChallengeData = getChallengeData(day, month, year, number_b);

        return res.status(200).json({
            nameNumber,AstronomicalSign,kuaNumber,kuaData,LuckyNumber,LuckyColours,Mantra,Yantra,LuckyYear,SuccessNumber,
            LuckyDates,Rudraksha,LuckyBracelet,PersonalityNumber,PersonalityNumberHindi,FavorableColor,
            Professional,LuckyDirection,BestDirections,ChallengeData
            // DisplayData,
            // FengshuiDirections,
            // BhagyankCycle,
            // ChallengeNumber,
            
        });
    }
    catch (error) {
        console.error("Error in calculation:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = app;