class FairPriceEstimate {
  final String category;
  final String itemName;
  final double minPrice;
  final double maxPrice;
  final double typicalPrice;
  final String currency;
  final String source;
  final double confidence;
  final String disclaimer;
  final PriceComparison? comparison;

  FairPriceEstimate({
    required this.category,
    required this.itemName,
    required this.minPrice,
    required this.maxPrice,
    required this.typicalPrice,
    required this.currency,
    required this.source,
    required this.confidence,
    required this.disclaimer,
    this.comparison,
  });

  factory FairPriceEstimate.fromJson(Map<String, dynamic> json) {
    return FairPriceEstimate(
      category: json['category'] ?? '',
      itemName: json['itemName'] ?? '',
      minPrice: (json['minPrice'] as num).toDouble(),
      maxPrice: (json['maxPrice'] as num).toDouble(),
      typicalPrice: (json['typicalPrice'] as num).toDouble(),
      currency: json['currency'] ?? 'INR',
      source: json['source'] ?? '',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.9,
      disclaimer: json['disclaimer'] ?? '',
      comparison: json['comparison'] != null
          ? PriceComparison.fromJson(json['comparison'])
          : null,
    );
  }
}

class PriceComparison {
  final double quotedPrice;
  final double differenceAmount;
  final double differencePercentage;
  final String verdict;
  final String verdictLabel;
  final String advice;

  PriceComparison({
    required this.quotedPrice,
    required this.differenceAmount,
    required this.differencePercentage,
    required this.verdict,
    required this.verdictLabel,
    required this.advice,
  });

  factory PriceComparison.fromJson(Map<String, dynamic> json) {
    return PriceComparison(
      quotedPrice: (json['quotedPrice'] as num).toDouble(),
      differenceAmount: (json['differenceAmount'] as num).toDouble(),
      differencePercentage: (json['differencePercentage'] as num?)?.toDouble() ?? 0.0,
      verdict: json['verdict'] ?? '',
      verdictLabel: json['verdictLabel'] ?? '',
      advice: json['advice'] ?? '',
    );
  }
}
