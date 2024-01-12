import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class NumerologyCalculator extends StatefulWidget {
  const NumerologyCalculator({Key? key}) : super(key: key);

  @override
  _NumerologyCalculatorState createState() => _NumerologyCalculatorState();
}

class _NumerologyCalculatorState extends State<NumerologyCalculator> {
  TextEditingController nameController = TextEditingController();
  TextEditingController dobController = TextEditingController();
  String selectedGender = ''; // Ensure this has a valid initial value
  String result = '';

  List<Map<String, String>> genderOptions = [
    {'label': 'Male', 'value': 'male'},
    {'label': 'Female', 'value': 'female'},
  ];

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );

    if (picked != null && picked != DateTime.now()) {
      String formattedDate = "${picked.day}-${picked.month}-${picked.year}";
      dobController.text = formattedDate;
    }
  }

  void showNumerologyDialog(BuildContext context, String result) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Numerology Results'),
          content: Container(
            width: double.maxFinite,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (String line in result.split('\n'))
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Text(line),
                    ),
                ],
              ),
            ),
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }

  void calculateNumerology() async {
    final String apiUrl = 'http://10.43.2.66:3000/calculate';

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': nameController.text,
          'dob': dobController.text,
          'gender': selectedGender,
        }),
      );

      print(nameController.text);
      print(dobController.text);
      print(selectedGender);

      if (response.statusCode == 200) {
        Map<String, dynamic> data = json.decode(response.body);
        setState(() {
          result = 'Name Number: ${data['nameNumber']}\n'
              'Astrological Sign: ${data['AstronomicalSign']}\n'
              'Kua Number: ${data['kuaNumber']}\n'
              //'Kua data: ${data['kuaData']}\n'
              'Lucky Numbers: ${joinIfList(data['LuckyNumber'])}\n'
              'Lucky Colours: ${joinIfList(data['LuckyColours'])}\n'
              'Mantra: ${data['Mantra']}\n'
              'Yantra: ${data['Yantra']}\n'
              'Lucky Years: ${joinIfList(data['LuckyYear'])}\n'
              'Success Number: ${data['SuccessNumber']}\n'
              'Lucky Dates: ${joinIfList(data['LuckyDates'])}\n'
              'Rudraksh: ${data['Rudraksha']}\n'
              'Lucky bracelet: ${data['LuckyBracelet']}\n'
              'Personality Number: ${data['PersonalityNumber']}\n'
              'Favorable Color: ${data['FavorableColor']}\n'
              'Professional: ${data['Professional']}\n'
              'Lucky Direction: ${data['LuckyDirection']}\n'
              'Best Directions: ${data['BestDirections']}\n'
              'Challenge Data:${data['ChallengeData']}';

          // Show the numerology results in a dialog
          showNumerologyDialog(context, result);
        });
      } else {
        setState(() {
          result = 'Error: ${response.reasonPhrase}';
        });
      }
    } catch (e) {
      setState(() {
        result = 'Error: $e';
      });
    }
  }

  String joinIfList(dynamic value) {
    if (value is List) {
      return value.join(', ');
    }
    return value.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Numerology Calculator'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: nameController,
              decoration: InputDecoration(labelText: 'Enter Your Name'),
            ),
            SizedBox(height: 16),
            GestureDetector(
              onTap: () => _selectDate(context),
              child: AbsorbPointer(
                child: TextField(
                  controller: dobController,
                  decoration: InputDecoration(labelText: 'Select Date of Birth'),
                ),
              ),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField(
              value: selectedGender.isNotEmpty ? selectedGender : null,
              onChanged: (String? newValue) {
                setState(() {
                  selectedGender = newValue!;
                });
              },
              items: genderOptions.map<DropdownMenuItem<String>>((Map<String, String> option) {
                return DropdownMenuItem<String>(
                  value: option['value'],
                  child: Text(option['label']!),
                );
              }).toList(),
              decoration: InputDecoration(labelText: 'Select Gender'),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: calculateNumerology,
              child: Text('Calculate Numerology'),
            ),
            SizedBox(height: 16),
            Text(
              result,
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
