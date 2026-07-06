/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getCulturalRecommendations(countryCode: string | undefined, weatherCode: number): string[] {
  const code = countryCode?.toUpperCase() || "";

  // Weather categories helper
  const isClear = weatherCode === 0;
  const isPartlyCloudy = weatherCode === 1 || weatherCode === 2;
  const isOvercast = weatherCode === 3;
  const isFoggy = weatherCode === 45 || weatherCode === 48;
  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode);
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isStormy = [95, 96, 99].includes(weatherCode);

  // USA SPECIFIC (US)
  if (code === "US") {
    if (isClear || isPartlyCloudy) {
      return [
        "Perfect day for a classic American baseball game, a tailgate party, or a hike in a state park.",
        "Great weather to fire up the backyard grill or go for a scenic cruise along local state highways."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Ideal day to visit an indie diner for warm apple pie & coffee, or browse a high-ceilinged modern art museum.",
        "Stay dry inside a local multi-screen cinema or explore a covered historical marketplace."
      ];
    }
    if (isOvercast || isFoggy) {
      return [
        "Perfect weather for a warm Americano at a local specialty coffee shop, or exploring an indoor farmer's market.",
        "Drive with caution through foggy roads; great day for an indoor bowling session."
      ];
    }
    if (isSnowy) {
      return [
        "Hit the ski slopes, go ice skating at a public town square rink, or enjoy a warm bowl of slow-cooked chili.",
        "Bundle up in a thick winter parka and enjoy spectacular snow-laden neighborhood views."
      ];
    }
  }

  // UNITED KINGDOM (GB / UK)
  if (code === "GB" || code === "UK") {
    if (isClear || isPartlyCloudy) {
      return [
        "Rare sunny spell! Rush to a classic Pub Garden (beer garden) for a pint of cider, or picnic in Hyde Park.",
        "Enjoy a brisk, delightful walk along the historic Thames Path or through a beautiful countryside manor garden."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Classic British weather! Pop into a traditional tea room for warm scones with clotted cream & Earl Grey.",
        "Perfect afternoon to wander through the British Museum, National Gallery, or cozy up in a historic wood-paneled pub."
      ];
    }
    if (isOvercast || isFoggy) {
      return [
        "Splendid day for countryside 'rambling' (hiking) followed by a comforting Sunday roast at a local inn.",
        "The moody mist makes for stunning gothic atmospheric photos of historic brick and stone streets."
      ];
    }
    if (isSnowy) {
      return [
        "Dress in thick tweed and woolens to see the snow-dusted historic spires and castles.",
        "Warm up inside a snug pub by a roaring open log fireplace with a plate of fish & chips."
      ];
    }
  }

  // JAPAN (JP)
  if (code === "JP") {
    if (isClear || isPartlyCloudy) {
      return [
        "Perfect weather for Hanami (strolling under cherry blossoms/foliage) or visiting a historic Zen temple.",
        "Beautiful day to walk through the traditional landscaped gardens of Kyoto or take panoramic city photos."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Experience a magical rainy day at an Onsen (traditional hot spring bath) or a serene tea ceremony.",
        "Wander through a covered 'Shotengai' (shopping arcade) or duck into a cozy underground ramen shop."
      ];
    }
    if (isOvercast || isFoggy) {
      return [
        "Ideal light for visiting a quiet Shinto shrine or enjoying warm matcha and wagashi (sweets) by a garden pond.",
        "Cozy up in a retro Kissaten (Japanese coffee house) or browse a local multi-story bookstore."
      ];
    }
    if (isSnowy) {
      return [
        "Stunning snow landscapes! Enjoy 'Yukimi' (snow-viewing) while soaking in a steaming outdoor bath (Rotenburo).",
        "Warm up with a hot pot (Nabe), fresh Oden from a local stall, and some warm sake."
      ];
    }
  }

  // AUSTRALIA (AU)
  if (code === "AU") {
    if (isClear || isPartlyCloudy) {
      return [
        "Fantastic day to fire up the public 'barbie' (BBQ) at a beach park, or hit the surf at Bondi or Manly.",
        "Sit outdoors at a beachside cafe and order a premium Australian flat white coffee."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Head indoors to explore a local craft brewery taproom or visit an state gallery exhibition.",
        "Enjoy some classic warm Australian meat pies or sausage rolls from an artisan bakery."
      ];
    }
    if (isOvercast || isFoggy) {
      return [
        "Great, cooler weather for a coastal cliff-top walk or visiting a national wildlife sanctuary.",
        "Explore covered laneways, hidden boutiques, and indoor coffee spots in cultural city centers."
      ];
    }
    if (isSnowy) {
      return [
        "Rare snow! Head up to the Snowy Mountains for some unique Australian winter alpine sports.",
        "Cozy up in a mountain cabin with beautiful views of snow-dusted eucalyptus trees."
      ];
    }
  }

  // INDIA (IN)
  if (code === "IN") {
    if (isClear || isPartlyCloudy) {
      return [
        "Excellent morning to explore grand heritage forts and monuments before the intense midday heat sets in.",
        "Sip on some fresh tender coconut water ('Nariyal Paani') from a street vendor to stay hydrated."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Monsoon vibes! Enjoy a hot glass of spiced Masala Chai paired with crispy, hot onion pakoras.",
        "Spend the rainy afternoon exploring local indoor handicraft emporiums or historical palaces."
      ];
    }
    if (isOvercast || isFoggy) {
      return [
        "Pleasant, cooler breeze—ideal for an evening stroll in a public garden or enjoying street food like pani puri.",
        "Great weather to visit a bustling indoor local bazaar or watch a colorful cinema screening."
      ];
    }
    if (isSnowy) {
      return [
        "Experience the breathtaking winter magic of Shimla, Manali, or Kashmir covered in powdery snow.",
        "Keep warm with delicious hot Kahwa (traditional saffron green tea spiced with almonds and cardamom)."
      ];
    }
  }

  // FRANCE (FR)
  if (code === "FR") {
    if (isClear || isPartlyCloudy) {
      return [
        "Perfect day for a stroll along the Seine, a picnic on the Champ de Mars, or sitting at an outdoor sidewalk bistro.",
        "Explore a local street market to pick up fresh cheese, baguettes, and seasonal fruits."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "A classic rainy Parisian mood. Spend the day browsing the Louvre, Musée d'Orsay, or a historic covered arcade.",
        "Warm up inside a cozy patisserie with a rich hot chocolate ('chocolat chaud') and a fresh croissant."
      ];
    }
  }

  // GERMANY (DE)
  if (code === "DE") {
    if (isClear || isPartlyCloudy) {
      return [
        "Perfect day to enjoy a cold Radler at a lively local Biergarten, or go cycling through a green forest ('Wald').",
        "Walk through the historic old town squares or sit outside at a bakery enjoying fresh pretzel and coffee."
      ];
    }
    if (isRainy || isStormy) {
      return [
        "Excellent day to relax and rejuvenate inside a traditional German 'Thermalbad' (sauna and spa complex).",
        "Head indoors to tour a majestic gothic cathedral, historic castle museum, or art gallery."
      ];
    }
  }

  // GENERAL FALLBACKS (BASED ON WORLDWIDE REGIONS)
  if (isClear || isPartlyCloudy) {
    return [
      "Perfect day to explore local historical landmarks, sample regional street food, or walk in a botanical garden.",
      "Excellent lighting and atmosphere for photography, outdoor markets, or patio dining."
    ];
  }
  if (isRainy || isStormy) {
    return [
      "Great opportunity to taste regional comfort dishes at a cozy neighborhood eatery.",
      "Spend the afternoon discovering local heritage inside a museum, gallery, or landmark library."
    ];
  }
  if (isOvercast || isFoggy) {
    return [
      "Great weather for exploring indoor shopping streets, shopping for local crafts, or visiting cozy local cafes.",
      "The diffused overcast lighting is exceptionally favorable for sightseeing photography."
    ];
  }
  if (isSnowy) {
    return [
      "Enjoy hot local winter beverages, visit scenic viewpoints to see snow-capped roofs, or relax by a fireplace.",
      "Try local winter dishes or desserts at a traditional mountain style inn or tavern."
    ];
  }

  return [
    "Layer up and enjoy local sightseeing, matching your pace to the gentle weather shift.",
    "Check out local cafes, craft shops, or indoor heritage sites for an authentic neighborhood vibe."
  ];
}
