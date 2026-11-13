class ItineraryStop {
  final int orderIndex;
  final String placeName;
  final String category;
  final String arrivalTime;
  final String departureTime;
  final double transportCost;
  final double activityCost;
  final String travelMethod;
  final String? safetyNote;

  ItineraryStop({
    required this.orderIndex,
    required this.placeName,
    required this.category,
    required this.arrivalTime,
    required this.departureTime,
    required this.transportCost,
    required this.activityCost,
    required this.travelMethod,
    this.safetyNote,
  });

  factory ItineraryStop.fromJson(Map<String, dynamic> json) {
    return ItineraryStop(
      orderIndex: json['orderIndex'] ?? 0,
      placeName: json['placeName'] ?? '',
      category: json['category'] ?? 'TRANSIT',
      arrivalTime: json['arrivalTime'] ?? '',
      departureTime: json['departureTime'] ?? '',
      transportCost: (json['transportCost'] as num?)?.toDouble() ?? 0.0,
      activityCost: (json['activityCost'] as num?)?.toDouble() ?? 0.0,
      travelMethod: json['travelMethod'] ?? 'Metro/Auto',
      safetyNote: json['safetyNote'],
    );
  }
}
