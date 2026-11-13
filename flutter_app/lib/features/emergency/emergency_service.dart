import 'package:url_launcher/url_launcher.dart';

class EmergencyService {
  static const String nationalEmergencyNumber = '112';
  static const String womenHelplineNumber = '1091';
  static const String touristPoliceNumber = '8750871111';

  static Future<void> dialEmergency(String number) async {
    final Uri uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      throw 'Could not trigger phone dialer for $number';
    }
  }
}
