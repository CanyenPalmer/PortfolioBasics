export type MinimalTestimonial = {
  app: string;
  quote: string;
  name?: string;
  role?: string;
  before: string[] | string;
  after: string[] | string;
};

export const TESTIMONIALS: MinimalTestimonial[] = [
  {
    app: "MyCaddy",
    quote:
      "MyCaddy was super impressive when we used it, I was surprised by the results. Not only was it accurate with what we put in, but it was able to work in areas that we were not getting very good service. I feel a lot more confident using the app to see how I should play a certain shot when I'm unsure on what to do. We will definitely use this at the very least in places 18 birdies and things like that won't load for us.",
    name: "C. Smith",
    role: "Amateur Golfer",
    before: [
      "Sometimes unsure how far the ball would actually play.",
      "Wanted a service that didn't charge over-the-top fees for results.",
      "Desired something that could be used on a mobile device for convenience and easy access.",
    ],
    after: [
      "Physics-based calculator that considers wind, temperature, lie conditions, and more.",
      "Works in areas with weaker cell service.",
      "Completely free to its users.",
    ],
  },
  {
    app: "Best Bet NFL",
    quote:
      "I always figured betting was rigged in the way they advertise their predictions. I know for a fact that Shaquan Barkley isn't going to run for 100 yards every night like Draft Kings makes their users believe in their betting parlays. Thanks to this app, I am able to get a better idea of how likely the bet is to hit in reality. Placing a bet on something that is highly probable isn't a guaranteed hit, but at least now I can have a better understanding to what the real chances are of this actually happening.",
    name: "G. Waterman",
    role: "Football Enthusiast",
    before: [
      "Unsure that margins on common betting apps were true.",
      "Needed a way to see actual probabilities without false scaling.",
      "Wanted true probability of a bet hitting without unneeded factors.",
    ],
    after: [
      "App for player bets, team vs team, and parlay bets that doesn’t 'juice' numbers.",
      "Probabilities based on past experiences, NFL averages, team ratings, and more.",
      "Calculates probability independent of +/- and wager odds, while still showing wager amounts.",
      "Includes a fallback calculation for rookies with limited starts.",
    ],
  },
];
