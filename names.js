const {readFileSync, promises: fsPromises} = require('fs');

var Names = ['Charles Herman',
    'Brian Castro',
    'Matthew Johnson',
    'Tonya Brooks',
    'Christopher Wood',
    'Randy Hernandez',
    'Jonathan Carter',
    'Daniel Garcia',
    'Kelsey Fernandez',
    'Tamara Wright',
    'Stephanie Robinson',
    'Jeffrey Owens',
    'Lucas Cruz',
    'Sarah Palmer',
    'Victoria Patterson',
    'Daniel Brennan',
    'Jesus Weber',
    'Michael Rivas',
    'Robyn Carter',
    'Mr. Michael Wilson',
    'Shannon Lopez',
    'Danny Kelley',
    'Kathy Patton',
    'Sarah Hoffman',
    'Dave Brown',
    'Kristin Sampson',
    'John Bailey',
    'Perry Smith',
    'Christopher Jimenez',
    'Scott Wiggins',
    'Brittany Lowe',
    'Jennifer Harris',
    'Eric Marshall',
    'Ashley Payne DDS',
    'Amanda Brown',
    'Robert Jenkins',
    'Kimberly Morales',
    'Angela Hurst',
    'Shawn Brown',
    'Donna Robertson',
    'Justin Evans',
    'Mark Berry',
    'Kevin Warren',
    'Austin Nelson',
    'Michael Martinez',
    'Shane Cardenas',
    'Joanna Pierce',
    'Briana Parker',
    'Brianna Flores',
    'Julie Gregory',
    'Nicole Crawford',
    'Debbie Rodriguez',
    'Mary Fuentes',
    'Michael Elliott',
    'Mr. Logan Daniels',
    'Laura Nelson',
    'Eric Hernandez',
    'Annette Green',
    'Melvin Tucker',
    'Jennifer Leon',
    'Kari Sandoval',
    'Dustin Mcfarland',
    'Tammy Williams',
    'Jennifer Oneill',
    'Jennifer Gaines',
    'Juan Watts',
    'Andrew Yang',
    'Jerry Horton',
    'Melissa Bradshaw',
    'Travis Fields',
    'Pamela Ellis',
    'Anna Ramsey',
    'Elizabeth Patterson',
    'Larry Zamora',
    'Sherry Rogers',
    'Valerie Arias',
    'Heather Kelly',
    'Kelly Campbell DDS',
    'Michael Thompson',
    'Gerald Spencer',
    'Kenneth Castro',
    'Stephanie Maldonado',
    'Cindy Martin',
    'Charles Rose',
    'Zachary Taylor',
    'Kenneth Coleman',
    'Shannon Hernandez',
    'Lisa Collins',
    'Scott Lucas',
    'Patrick Burke',
    'Michelle Lewis',
    'Dr. Jose Cunningham',
    'Thomas Todd MD',
    'Lance Osborne',
    'Christopher Dennis',
    'Anthony Johnston',
    'Ronald White',
    'Emily Garcia',
    'Brenda Jones',
    'Leslie Manning',
    'Brenda Anderson',
    'Billy Watts',
    'Jerry Ross',
    'Patricia Watkins',
    'Michael Farley',
    'Matthew Cunningham',
    'Jacob Huffman',
    'Daniel Lucas DDS',
    'Marissa Moss',
    'Elizabeth Long',
    'Brittany Day PhD',
    'Samantha Craig',
    'Jeremiah Gray',
    'Dawn Brown',
    'Paul Oliver',
    'Christopher Kirby',
    'Gregory Williams',
    'Rebecca Nunez',
    'Theresa Perry',
    'Donald Nelson',
    'Christina Martinez',
    'Michael Lang',
    'Matthew Harris',
    'Norma Gates',
    'Bill Burgess',
    'James Gonzalez',
    'Tamara Long',
    'Amy Rivera',
    'Teresa Yang',
    'Suzanne Rogers',
    'Adam Wright',
    'Ariel Owen',
    'Brittney Carroll',
    'Traci Alvarez',
    'Kimberly Montgomery',
    'John Reynolds',
    'Richard Cannon',
    'Ryan Cervantes',
    'Eric Mora',
    'Randy Duffy',
    'Sherry Stark',
    'Christopher Ritter',
    'James Howell',
    'Dana Brown',
    'Jason Howard',
    'Misty Lutz',
    'Melissa Brown',
    'Kyle Bautista',
    'Samantha Jacobs',
    'Colleen Ramsey',
    'Carlos Friedman',
    'Regina Brooks',
    'Tanner Le',
    'Lauren Martinez',
    'Michael Turner',
    'Mike Guzman',
    'Ashley Deleon',
    'Keith Jones',
    'Bradley Morris',
    'Christian Haney',
    'Timothy Hughes',
    'Donna Johnson',
    'David James',
    'Alexandra Anderson',
    'Julie Kane',
    'Todd Waters',
    'Taylor Jarvis',
    'Stephanie Smith',
    'Sheila Manning',
    'Steven Myers',
    'Wyatt Guerrero',
    'Warren Chapman',
    'William Khan',
    'Jennifer Kane',
    'Amy Gomez',
    'Kelsey Nguyen',
    'Joshua Garner',
    'Jennifer Turner',
    'Cameron Hogan',
    'Samantha Rodriguez',
    'Brenda Pierce',
    'Alice Robbins',
    'John Jennings',
    'Jenna Cruz',
    'Robert Perez',
    'Arthur Lucas',
    'Jerry Holmes',
    'William Sanders',
    'Jennifer Wise',
    'Karen Ho',
    'Luis Jimenez',
    'Anna Walton',
    'Erin Stewart',
    'Shari Bautista',
    'Christine Nelson',
    'Kelly Bates',
    'Paul Webb',
    'Jason Estes',
    'Mario Everett',
    'Amy Norman',
    'Joshua Cross',
    'Debra Melton',
    'Deanna Fisher',
    'Kerry Meyer',
    'Marcus Bailey',
    'Jeffrey Elliott',
    'David Horton',
    'Anne Byrd',
    'Elizabeth Hall',
    'Nicole Benton',
    'Arthur Collins',
    'Michael Anderson',
    'Michael Cole',
    'Brandon Ryan',
    'Samantha Roberts',
    'Alex Martin',
    'Richard Williams',
    'Judy Smith',
    'Andrew Fox',
    'Melanie Francis',
    'Brittany Smith',
    'Sharon Conrad',
    'Joshua Reeves',
    'Alexis Miller',
    'Carol Walls',
    'Michael Weaver',
    'Kyle Mccall',
    'Maria Ellis',
    'Blake Warren',
    'Mary Butler',
    'Edwin Martin',
    'Jessica Burnett',
    'Kyle Gordon',
    'Andrew Peterson',
    'Nicholas Cross MD',
    'Micheal Henderson',
    'Joseph Booth',
    'Kevin Sanchez',
    'Erik Rollins',
    'Latasha Warren',
    'Tiffany Merritt',
    'Nathan Powell',
    'Amy Hill',
    'Virginia Clark',
    'Kathleen Bond',
    'John Combs',
    'Melissa Pierce',
    'Nicholas Schmidt',
    'Nicholas Barber',
    'Jennifer Cole',
    'Elizabeth Davidson',
    'Carolyn Harris',
    'Lindsay Reed',
    'Jordan Hutchinson',
    'Wesley Graham',
    'Joy Cummings',
    'Laura Sharp',
    'Jennifer Parsons',
    'Justin Newman',
    'Nathan Beasley',
    'Kelly Poole',
    'Brandon Torres',
    'Nancy Boone',
    'Joseph Colon',
    'Dr. Anthony Perez',
    'Joseph Cain',
    'Jessica Martinez',
    'Heather Turner',
    'Roy Esparza',
    'Theresa Robertson',
    'Joshua Doyle',
    'Jennifer Davis',
    'Douglas Hurley',
    'Phillip Hamilton',
    'David Stewart',
    'Sandra Sims',
    'Heather Gonzalez',
    'Jaime Gordon',
    'Rebecca Lewis',
    'Kyle Lopez',
    'Melanie Bailey',
    'Michelle Durham',
    'Brian Smith',
    'Dana Greene',
    'Christine Welch',
    'Tyler Padilla',
    'Natalie Walton',
    'Daniel Oneill',
    'Christopher White',
    'Amy Dickson',
    'Todd Martinez',
    'Michael Hendricks',
    'Jared Larson',
    'Alexis Jackson',
    'James Flores',
    'Mr. Andrew Shaw',
    'Catherine Swanson',
    'Mark Rodriguez',
    'Austin Waters',
    'Linda Mora MD',
    'Michael Lee',
    'Ian Howard',
    'Rachel Lawson',
    'Breanna Figueroa',
    'Jason Jones',
    'Matthew Holmes',
    'Ms. Alexis Washington',
    'James Brown',
    'Deborah Armstrong',
    'Michael Randolph',
    'Jennifer Frey',
    'Andrew Williams',
    'Carol Eaton',
    'Steven Fischer',
    'Colin Hunt',
    'Rebekah Anderson',
    'Cindy Owen',
    'Stephanie Austin',
    'Jessica Williams',
    'Jessica Ramirez',
    'Jason Martin',
    'Jordan Parsons',
    'Kathleen Morrison',
    'Megan Haynes',
    'Lance Sanders',
    'Natasha Freeman',
    'Bonnie Brown',
    'Joshua Carter',
    'Jessica Allen',
    'Matthew Manning',
    'Tara Oneal',
    'Tyler Wheeler',
    'Ms. Elizabeth Smith',
    'Chad Williams',
    'Matthew Zavala',
    'Kristin Stewart MD',
    'Russell Levy',
    'Matthew Summers',
    'Travis Wright',
    'Mrs. Rachel Evans',
    'Rachel Campbell',
    'Jared Robinson',
    'Rhonda Baker',
    'Trevor Jones',
    'Jeffrey Reyes',
    'Kimberly Wright',
    'Karen Thompson',
    'Julie Aguilar',
    'Terry Green',
    'Shelia Morris',
    'Ashley Black',
    'Xavier Phillips',
    'Melissa Taylor',
    'David Hernandez',
    'Alexander Benson',
    'Dr. Kristy White',
    'Debra Li',
    'Donna Smith',
    'Chloe Huber',
    'Anthony Montgomery',
    'Jacob Moore',
    'Scott Baldwin',
    'Sarah Smith',
    'Dominique Davis',
    'Ashley Williams',
    'Kelly Parsons',
    'William Moore',
    'Makayla Dean',
    'Phillip Moreno',
    'Emily Clarke',
    'John Roberson',
    'George Pena',
    'Brianna Hancock',
    'Leroy Davis',
    'Chad Bowman',
    'Diana Jackson',
    'Brett Brown',
    'Katie Dennis',
    'Stephanie Giles',
    'Cory Owens PhD',
    'Felicia Dixon',
    'Jill Ponce',
    'Ashley Wright',
    'Amanda Farmer',
    'Nathan Wilcox',
    'Judith Warren',
    'Brittney Walters',
    'Deborah Henderson',
    'Linda Green',
    'Matthew Castro',
    'Rhonda Vasquez',
    'Annette Carroll',
    'Evan Banks',
    'Benjamin Anderson',
    'John Pham',
    'Lisa Wilcox',
    'Gerald Foster',
    'Misty Kirby',
    'Jennifer Farmer',
    'Lisa Schultz',
    'Ashley Mills',
    'Jesus Nelson',
    'Duane Anthony',
    'Elizabeth Cohen',
    'Anita Clark',
    'Meredith Campbell',
    'Jose Brown',
    'Deborah Moore',
    'John Riggs',
    'William Banks',
    'Jean Edwards',
    'Victoria Chapman',
    'Christopher Mckinney',
    'Justin Edwards',
    'Carly Perry',
    'Christopher Jenkins',
    'Andre Wood',
    'Kayla Wilkinson',
    'Derek Jones',
    'Bernard Smith',
    'Alyssa Jacobs',
    'Cynthia Solis',
    'Nancy Mcdaniel',
    'Travis Lee',
    'Amy Hart',
    'Adam Morrison',
    'Jacob Gutierrez',
    'Jennifer Bailey',
    'Kevin Mckinney',
    'Laura Jones',
    'Timothy Weber',
    'James Zhang',
    'Jacob Vasquez',
    'Katherine Monroe',
    'Felicia Fisher',
    'Amber Peterson',
    'William Lucas',
    'Amanda Murphy',
    'Whitney Wagner',
    'Amy Williams',
    'Sean Brown',
    'Tammy Hughes',
    'Jennifer Gonzalez',
    'Steven Kirby',
    'Brenda Jones',
    'Edward Carr',
    'Zachary Sanchez',
    'Carmen Bryant',
    'Rodney Wilson',
    'Shannon Singleton',
    'Zachary Cox',
    'Hayden Brooks',
    'Caroline Smith',
    'Jeremy Pena',
    'Michelle Harris',
    'Mr. Gregory Villanueva MD',
    'Christina Hunt',
    'Mr. Christopher King DDS',
    'Vincent Randall',
    'Joseph Johnson',
    'Timothy Gonzalez',
    'Jessica Orozco',
    'Destiny Malone',
    'Edward Price',
    'Anna Collins',
    'Patricia Chambers MD',
    'Daniel Prince',
    'Linda Williams',
    'Christina Powers',
    'Melanie Cruz',
    'Dale Jones',
    'Suzanne Hall',
    'Charles Cook',
    'Juan Crane',
    'Alexandra Adams',
    'Mr. Joseph Perez',
    'Jeremy Bender',
    'Patrick Harris',
    'Taylor Baker',
    'Danny Nolan',
    'Anthony King',
    'Alexis Ortiz',
    'Daniel Carlson',
    'Alexander Berg',
    'Rachel Roberson',
    'James Moss',
    'Cody Thomas',
    'Jacob Morales',
    'Nicole Cole',
    'Morgan Carroll',
    'Shelly Mccormick',
    'Ivan Anderson',
    'Patricia Figueroa',
    'Lisa Harper',
    'Nicholas Santiago',
    'Kimberly Collins',
    'Alex Mcclure',
    'Scott Morris',
    'Roger Moss',
    'Steven Gross'
]

for (let i = 0; i < Names.length; i++) {
    let firstname = Names[i].substring(0, Names[i].indexOf(' '));
    let lastname = Names[i].substring(Names[i].indexOf(' ') + 1);
    console.log('INSERT INTO Person (FirstName, LastName) VALUES (\'' + firstname.trim() + '\',\'' + lastname + '\');');
}