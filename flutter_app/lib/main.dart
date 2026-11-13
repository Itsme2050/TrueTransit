import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'core/theme.dart';

void main() {
  runApp(const ProviderScope(child: TrueTransitApp()));
}

class TrueTransitApp extends StatelessWidget {
  const TrueTransitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TrueTransit',
      debugShowCheckedModeBanner: false,
      theme: TrueTransitTheme.lightTheme,
      home: const DashboardHomeScreen(),
    );
  }
}

class DashboardHomeScreen extends StatefulWidget {
  const DashboardHomeScreen({super.key});

  @override
  State<DashboardHomeScreen> createState() => _DashboardHomeScreenState();
}

class _DashboardHomeScreenState extends State<DashboardHomeScreen> {
  int _currentIndex = 0;

  Future<void> _openDialer(String number) async {
    final Uri uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No phone app available to dial $number')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.shield_outlined, color: Colors.tealAccent),
            SizedBox(width: 8),
            Text(
              'TrueTransit',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Dial 112',
            icon: const Icon(Icons.emergency_share, color: Colors.roseAccent),
            onPressed: () => _openDialer('112'),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.security, size: 64, color: TrueTransitTheme.tealSecondary),
              const SizedBox(height: 16),
              const Text(
                'More than maps. Your true local guardian.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: TrueTransitTheme.navyPrimary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Connected to TrueTransit Backend API (http://localhost:5000/api/v1)',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => _openDialer('112'),
                icon: const Icon(Icons.calculate),
                label: const Text('Call 112 (National Emergency)'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: TrueTransitTheme.navyPrimary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Price checking, safety routing and itinerary planning are being wired to the API in the web client; the mobile build is scaffolded here.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 11, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.price_check), label: 'Prices'),
          NavigationDestination(icon: Icon(Icons.map), label: 'Safety'),
          NavigationDestination(icon: Icon(Icons.auto_awesome), label: 'Itinerary'),
        ],
      ),
    );
  }
}
