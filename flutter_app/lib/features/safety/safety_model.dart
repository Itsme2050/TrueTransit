class RouteAlternative {
  final String id;
  final String name;
  final String type; // FASTEST, SAFEST, BALANCED
  final double distanceKm;
  final int durationMinutes;
  final int safetyScore;
  final String safetyLevel;
  final String tradeOffSummary;
  final String rationale;

  RouteAlternative({
    required this.id,
    required this.name,
    required this.type,
    required this.distanceKm,
    required this.durationMinutes,
    required this.safetyScore,
    required this.safetyLevel,
    required this.tradeOffSummary,
    required this.rationale,
  });

  factory RouteAlternative.fromJson(Map<String, dynamic> json) {
    return RouteAlternative(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? 'BALANCED',
      distanceKm: (json['distanceKm'] as num).toDouble(),
      durationMinutes: json['durationMinutes'] ?? 0,
      safetyScore: json['safetyScore'] ?? 75,
      safetyLevel: json['safetyLevel'] ?? 'LOWER_CONCERN',
      tradeOffSummary: json['tradeOffSummary'] ?? '',
      rationale: json['rationale'] ?? '',
    );
  }
}
