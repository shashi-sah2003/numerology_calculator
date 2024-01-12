import 'package:flutter/material.dart';
import 'numerology_calculator.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Numerology Calculator',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: NumerologyCalculator(),
    );
  }
}