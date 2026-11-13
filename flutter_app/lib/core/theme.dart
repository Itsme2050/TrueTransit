import 'package:flutter/material.dart';

class TrueTransitTheme {
  static const Color navyPrimary = Color(0xFF0B1B2D);
  static const Color tealSecondary = Color(0xFF0D9488);
  static const Color offWhiteBg = Color(0xFFF8FAFC);
  static const Color amberWarning = Color(0xFFF59E0B);
  static const Color roseDanger = Color(0xFFE11D48);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: tealSecondary,
        primary: navyPrimary,
        secondary: tealSecondary,
        surface: offWhiteBg,
        error: roseDanger,
      ),
      scaffoldBackgroundColor: offWhiteBg,
      appBarTheme: const AppBarTheme(
        backgroundColor: navyPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
