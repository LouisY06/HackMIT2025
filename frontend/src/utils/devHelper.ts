// Developer Helper - Console Navigation Commands
// Only available in development mode

export const createDevHelper = (navigate: (path: string) => void) => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Create global warp function for console access
  (window as any).warp = {
    // Landing and Auth Pages
    home: () => navigate('/'),
    landing: () => navigate('/'),
    login: () => navigate('/login'),
    mainLogin: () => navigate('/login'),

    // Volunteer Pages
    volunteerLogin: () => navigate('/volunteer-login'),
    volunteerDashboard: () => navigate('/volunteer/dashboard'),
    volunteerProfile: () => navigate('/volunteer/profile-setup'),
    volunteerPickups: () => navigate('/volunteer/find-pickups'),
    volunteerRewards: () => navigate('/volunteer/rewards'),
    volunteerLeaderboard: () => navigate('/volunteer/leaderboard'),
    volunteerImpact: () => navigate('/volunteer/global-impact'),

    // Store Pages
    storeLogin: () => navigate('/store-login'),
    storeDashboard: () => navigate('/store/dashboard'),
    storeProfile: () => navigate('/store/profile-setup'),
    storeCreate: () => navigate('/store/create-package'),
    storePackages: () => navigate('/store/packages'),
    storeImpact: () => navigate('/store/impact'),
    storeGlobalImpact: () => navigate('/store/global-impact'),

    // Food Bank Pages
    foodbankLogin: () => navigate('/foodbank-login'),
    foodbankDashboard: () => navigate('/foodbank/dashboard'),
    foodbankProfile: () => navigate('/foodbank/profile-setup'),
    foodbankDelivery: () => navigate('/foodbank/delivery-log'),
    foodbankImpact: () => navigate('/foodbank/global-impact'),

    // Helper functions
    help: () => {
      console.log(`
🚀 REFLOURISH DEV HELPER - Navigation Commands

📱 MAIN PAGES:
  warp.home()           → Landing page
  warp.login()          → Main login (role selection)

🚚 VOLUNTEER PAGES:
  warp.volunteerLogin()      → Volunteer login
  warp.volunteerDashboard()  → Volunteer dashboard
  warp.volunteerProfile()    → Volunteer profile setup
  warp.volunteerPickups()    → Find pickups
  warp.volunteerRewards()    → Rewards page
  warp.volunteerLeaderboard() → Leaderboard
  warp.volunteerImpact()     → Global impact

🏪 STORE PAGES:
  warp.storeLogin()         → Store login
  warp.storeDashboard()     → Store dashboard
  warp.storeProfile()       → Store profile setup
  warp.storeCreate()        → Create package
  warp.storePackages()      → View packages
  warp.storeImpact()        → Store impact
  warp.storeGlobalImpact()  → Global impact

🏛️ FOOD BANK PAGES:
  warp.foodbankLogin()      → Food bank login
  warp.foodbankDashboard()  → Food bank dashboard
  warp.foodbankProfile()    → Food bank profile setup
  warp.foodbankDelivery()   → Delivery log
  warp.foodbankImpact()     → Global impact

🛠️ UTILITIES:
  warp.help()               → Show this help
  warp.routes()             → List all available routes
  warp.clear()              → Clear console

💡 TIP: Just type "warp." in console to see autocomplete options!
      `);
    },

    routes: () => {
      const routes = [
        '/',
        '/login',
        '/volunteer-login',
        '/volunteer/dashboard',
        '/volunteer/profile-setup',
        '/volunteer/find-pickups',
        '/volunteer/rewards',
        '/volunteer/leaderboard',
        '/volunteer/global-impact',
        '/store-login',
        '/store/dashboard',
        '/store/profile-setup',
        '/store/create-package',
        '/store/packages',
        '/store/impact',
        '/store/global-impact',
        '/foodbank-login',
        '/foodbank/dashboard',
        '/foodbank/profile-setup',
        '/foodbank/delivery-log',
        '/foodbank/global-impact',
      ];
      
      console.log('📍 Available Routes:', routes);
      return routes;
    },

    clear: () => console.clear(),

    // Quick shortcuts for common workflows
    testVolunteer: () => {
      console.log('🚚 Testing Volunteer Flow...');
      navigate('/volunteer-login');
    },
    
    testStore: () => {
      console.log('🏪 Testing Store Flow...');
      navigate('/store-login');
    },
    
    testFoodbank: () => {
      console.log('🏛️ Testing Food Bank Flow...');
      navigate('/foodbank-login');
    },
  };

  // Auto-show help on first load
  console.log(`
🎯 REFLOURISH DEV HELPER LOADED!
Type "warp.help()" for navigation commands
Type "warp." and press TAB for autocomplete
  `);

  return (window as any).warp;
};

// TypeScript declarations for better IDE support
declare global {
  interface Window {
    warp: {
      home: () => void;
      landing: () => void;
      login: () => void;
      mainLogin: () => void;
      volunteerLogin: () => void;
      volunteerDashboard: () => void;
      volunteerProfile: () => void;
      volunteerPickups: () => void;
      volunteerRewards: () => void;
      volunteerLeaderboard: () => void;
      volunteerImpact: () => void;
      storeLogin: () => void;
      storeDashboard: () => void;
      storeProfile: () => void;
      storeCreate: () => void;
      storePackages: () => void;
      storeImpact: () => void;
      storeGlobalImpact: () => void;
      foodbankLogin: () => void;
      foodbankDashboard: () => void;
      foodbankProfile: () => void;
      foodbankDelivery: () => void;
      foodbankImpact: () => void;
      help: () => void;
      routes: () => string[];
      clear: () => void;
      testVolunteer: () => void;
      testStore: () => void;
      testFoodbank: () => void;
    };
  }
}

export default createDevHelper;
