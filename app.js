// GalliBites.AI Application with Working Authentication
console.log('🚀 Loading GalliBites.AI Application...');

// Application Data
const APP_DATA = {
    sampleVendors: [
        {
            id: 1,
            name: "Raju Kumar",
            businessName: "Raju Bhaiya Samosa Corner",
            phone: "9876543210",
            email: "raju.samosa@gmail.com",
            location: "Dadar, Mumbai",
            specialty: "Samosas & Chaat",
            fssaiLicense: "12345678901234",
            password: "password123"
        }
    ],
    suppliers: [
        {
            id: 1,
            name: "Fresh Vegetables Mart",
            location: "Dadar Market, Mumbai",
            rating: 4.5,
            deliveryTime: "2-4 hours",
            minOrder: 500,
            fssaiCertified: true
        },
        {
            id: 2,
            name: "Spice Palace",
            location: "Crawford Market, Mumbai",
            rating: 4.8,
            deliveryTime: "Same day",
            minOrder: 1000,
            fssaiCertified: true
        }
    ],
    products: [
        {
            id: 1,
            name: "Potatoes",
            category: "vegetables",
            currentPrice: 28,
            yesterdayPrice: 32,
            unit: "per kg",
            suppliers: [1, 2],
            seasonal: true,
            perishable: true,
            icon: "🥔"
        },
        {
            id: 2,
            name: "Cumin Powder",
            category: "spices",
            currentPrice: 450,
            yesterdayPrice: 445,
            unit: "per kg",
            suppliers: [2],
            seasonal: false,
            perishable: false,
            icon: "🧂"
        },
        {
            id: 3,
            name: "Refined Oil",
            category: "oil",
            currentPrice: 165,
            yesterdayPrice: 168,
            unit: "per liter",
            suppliers: [1, 2],
            seasonal: false,
            perishable: false,
            icon: "🛢️"
        },
        {
            id: 4,
            name: "Onions",
            category: "vegetables",
            currentPrice: 35,
            yesterdayPrice: 40,
            unit: "per kg",
            suppliers: [1],
            seasonal: true,
            perishable: true,
            icon: "🧅"
        },
        {
            id: 5,
            name: "Basmati Rice",
            category: "grains",
            currentPrice: 85,
            yesterdayPrice: 85,
            unit: "per kg",
            suppliers: [1, 2],
            seasonal: false,
            perishable: false,
            icon: "🌾"
        },
        {
            id: 6,
            name: "Paper Bags",
            category: "packaging",
            currentPrice: 12,
            yesterdayPrice: 12,
            unit: "per 100 pcs",
            suppliers: [2],
            seasonal: false,
            perishable: false,
            icon: "📦"
        }
    ],
    inventoryItems: [
        {
            id: 1,
            name: "Potatoes",
            currentStock: 15,
            unit: "kg",
            reorderLevel: 10,
            avgDailyUsage: 5,
            daysUntilReorder: 1,
            lastPrice: 25,
            preferredSupplier: "Fresh Vegetables Mart",
            icon: "🥔",
            status: "Low Stock"
        },
        {
            id: 2,
            name: "Cooking Oil",
            currentStock: 3,
            unit: "liters",
            reorderLevel: 5,
            avgDailyUsage: 2,
            daysUntilReorder: 0,
            lastPrice: 120,
            preferredSupplier: "Oil Depot",
            icon: "🛢️",
            status: "Low Stock"
        },
        {
            id: 3,
            name: "Cumin Powder",
            currentStock: 2.5,
            unit: "kg",
            reorderLevel: 1,
            avgDailyUsage: 0.2,
            daysUntilReorder: 12,
            lastPrice: 450,
            preferredSupplier: "Spice Palace",
            icon: "🧂",
            status: "Good Stock"
        }
    ],
    communityPosts: [
        {
            author: "Sunita Devi",
            business: "Chaat Corner",
            post: "Found great quality onions at Vashi Market - ₹5 cheaper than usual rates! 🧅 Quality is really good, perfect for bhaji making. Highly recommend!",
            time: "2 hours ago",
            likes: 12,
            location: "Navi Mumbai"
        },
        {
            author: "Mohan Singh",
            business: "Punjabi Dhaba",
            post: "🚨 Warning: Avoid XYZ Suppliers in Malad area. Poor quality vegetables and unreliable delivery. Better to pay ₹2-3 more elsewhere.",
            time: "4 hours ago",
            likes: 8,
            location: "Andheri"
        }
    ]
};

// Global Application State
let currentUser = null;
let currentSection = 'dashboard';
let currentCategory = 'all';
let cart = [];
let isAuthenticated = false;

// Utility Functions
function showNotification(message, type = 'success') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--color-error)' : 'var(--color-success)'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
        white-space: pre-line;
        line-height: 1.4;
        font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, type === 'error' ? 6000 : 3000);
}

function setButtonLoading(button, loading) {
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
        button.disabled = true;
        if (btnText) btnText.classList.add('hidden');
        if (btnLoader) btnLoader.classList.remove('hidden');
    } else {
        button.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
    }
}

// Authentication Functions
function checkExistingSession() {
    try {
        const userData = localStorage.getItem('gallibites_user');
        const sessionToken = localStorage.getItem('gallibites_session');
        
        if (userData && sessionToken) {
            currentUser = JSON.parse(userData);
            isAuthenticated = true;
            console.log('✅ Found existing session for:', currentUser.name);
            showMainApplication();
            return true;
        }
    } catch (error) {
        console.log('❌ Session check error:', error);
        clearSession();
    }
    
    console.log('🔐 No valid session found');
    showAuthenticationPages();
    return false;
}

function clearSession() {
    localStorage.removeItem('gallibites_user');
    localStorage.removeItem('gallibites_session');
    localStorage.removeItem('gallibites_remember');
}

function authenticateUser(user, rememberMe = false) {
    console.log('✅ Authenticating user:', user.name);
    
    currentUser = user;
    isAuthenticated = true;
    
    // Store session
    try {
        localStorage.setItem('gallibites_user', JSON.stringify(user));
        localStorage.setItem('gallibites_session', 'authenticated_' + Date.now());
        if (rememberMe) {
            localStorage.setItem('gallibites_remember', 'true');
        }
    } catch (error) {
        console.log('❌ Error storing session:', error);
    }
    
    showMainApplication();
    updateUserInterface();
    showNotification(`Welcome ${user.name}! 🎉`);
}

function logout() {
    console.log('🚪 Logging out user:', currentUser ? currentUser.name : 'Unknown');
    
    clearSession();
    currentUser = null;
    isAuthenticated = false;
    cart = [];
    
    showAuthenticationPages();
    showAuthPage('landing-page');
    showNotification('Logged out successfully. Visit again soon! 👋');
}

// Page Navigation Functions
function showAuthenticationPages() {
    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');
    
    if (authContainer) {
        authContainer.style.display = 'flex';
        console.log('🔐 Auth container shown');
    }
    if (mainApp) {
        mainApp.classList.add('hidden');
        console.log('🏠 Main app hidden');
    }
}

function showMainApplication() {
    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');
    
    if (authContainer) {
        authContainer.style.display = 'none';
        console.log('🔐 Auth container hidden');
    }
    if (mainApp) {
        mainApp.classList.remove('hidden');
        console.log('🏠 Main app shown');
        initializeMainApp();
    }
}

function showAuthPage(pageId) {
    console.log('📄 Showing auth page:', pageId);
    
    const authPages = document.querySelectorAll('.auth-page');
    authPages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`✅ Auth page ${pageId} is now active`);
    } else {
        console.log(`❌ Auth page not found: ${pageId}`);
    }
}

// Main App Functions
function updateUserInterface() {
    if (!currentUser) return;
    
    console.log('🎨 Updating UI for:', currentUser.name);
    
    // Update greeting
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) {
        userGreeting.textContent = `नमस्ते ${currentUser.name}!`;
    }
    
    // Update dashboard
    const dashboardGreeting = document.getElementById('dashboard-greeting');
    const businessInfo = document.getElementById('dashboard-business-info');
    
    if (dashboardGreeting) {
        dashboardGreeting.textContent = `Welcome back, ${currentUser.name}! 🙏`;
    }
    if (businessInfo) {
        businessInfo.textContent = `${currentUser.businessName} • ${currentUser.location}`;
    }
    
    // Update profile
    const profileName = document.getElementById('profile-name');
    const profileBusiness = document.getElementById('profile-business');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileBusiness) profileBusiness.textContent = currentUser.businessName;
}

function showSection(sectionId) {
    console.log(`📄 Showing section: ${sectionId}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Load section content
        switch(sectionId) {
            case 'marketplace':
                renderProducts(APP_DATA.products);
                break;
            case 'inventory':
                renderInventoryList();
                break;
            case 'suppliers':
                renderSuppliersList();
                break;
            case 'community':
                renderCommunityPosts();
                break;
            case 'group-buying':
                updateGroupBuyProgress();
                break;
        }
        
        console.log(`✅ Section ${sectionId} is now active`);
    } else {
        console.log(`❌ Section not found: ${sectionId}`);
    }
}

function navigateToSection(sectionId, message) {
    showSection(sectionId);
    
    // Update navigation state
    const navItems = document.querySelectorAll('.nav__item');
    navItems.forEach(nav => nav.classList.remove('active'));
    const targetNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }
    
    if (message) showNotification(message);
}

// Rendering Functions
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    console.log(`📦 Rendering ${products.length} products`);
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const priceTrend = product.currentPrice > product.yesterdayPrice ? 'up' : 'down';
        const trendIcon = priceTrend === 'up' ? '📈' : '📉';
        const trendPercent = Math.abs(((product.currentPrice - product.yesterdayPrice) / product.yesterdayPrice) * 100).toFixed(0);
        const supplierCount = product.suppliers.length;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-card__header">
                <h3>${product.icon} ${product.name}</h3>
                <div class="price-trend ${priceTrend}">${trendIcon} ${trendPercent}%</div>
            </div>
            <div class="product-card__price">
                <span class="current-price">₹${product.currentPrice}/${product.unit.replace('per ', '')}</span>
                <span class="old-price">₹${product.yesterdayPrice}/${product.unit.replace('per ', '')}</span>
            </div>
            <div class="product-card__suppliers">
                <span>${supplierCount} supplier${supplierCount > 1 ? 's' : ''} available</span>
            </div>
            <div class="product-card__actions">
                <button class="btn btn--sm btn--outline" data-action="compare" data-product-id="${product.id}">Compare Prices</button>
                <button class="btn btn--sm btn--primary" data-action="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
            ${product.seasonal ? '<div class="ai-recommendation">🤖 Best Buy: Seasonal low prices!</div>' : ''}
        `;
        productsGrid.appendChild(productCard);
    });
}

function renderInventoryList() {
    const inventoryList = document.querySelector('.inventory-list');
    if (!inventoryList) return;
    
    console.log('📊 Rendering inventory list');
    inventoryList.innerHTML = '';
    
    APP_DATA.inventoryItems.forEach(item => {
        const inventoryItem = document.createElement('div');
        inventoryItem.className = `inventory-item ${item.status === 'Low Stock' ? 'low-stock' : ''}`;
        
        const statusClass = item.status === 'Low Stock' ? 'warning' : 'success';
        
        inventoryItem.innerHTML = `
            <div class="item-info">
                <h3>${item.icon} ${item.name}</h3>
                <p>Current Stock: ${item.currentStock} ${item.unit}</p>
                <div class="usage-info">Daily usage: ${item.avgDailyUsage}${item.unit} • Days left: ${item.daysUntilReorder}</div>
            </div>
            <div class="item-status">
                <span class="status status--${statusClass}">${item.status}</span>
                ${item.status === 'Low Stock' ? `<button class="btn btn--sm btn--primary" data-action="reorder" data-product="${item.name}">Reorder</button>` : ''}
            </div>
        `;
        
        inventoryList.appendChild(inventoryItem);
    });
}

function renderSuppliersList() {
    const suppliersList = document.querySelector('.suppliers-list');
    if (!suppliersList) return;
    
    console.log('🏪 Rendering suppliers list');
    suppliersList.innerHTML = '';
    
    APP_DATA.suppliers.forEach(supplier => {
        const supplierCard = document.createElement('div');
        supplierCard.className = 'supplier-card';
        
        supplierCard.innerHTML = `
            <div class="supplier-header">
                <h3>${supplier.name}</h3>
                <div class="supplier-rating">⭐ ${supplier.rating}/5</div>
            </div>
            <div class="supplier-info">
                <p>📍 ${supplier.location}</p>
                <p>🚚 Delivery: ${supplier.deliveryTime}</p>
                <p>💰 Min Order: ₹${supplier.minOrder}</p>
            </div>
            <div class="supplier-badges">
                ${supplier.fssaiCertified ? '<span class="badge fssai">✅ FSSAI Certified</span>' : ''}
                <span class="badge verified">✅ Verified</span>
            </div>
            <div class="supplier-actions">
                <button class="btn btn--sm btn--outline" data-action="view-products" data-supplier-id="${supplier.id}">View Products</button>
                <button class="btn btn--sm btn--primary" data-action="contact-supplier" data-supplier-id="${supplier.id}">Contact</button>
            </div>
        `;
        
        suppliersList.appendChild(supplierCard);
    });
}

function renderCommunityPosts() {
    const postsList = document.querySelector('.posts-list');
    if (!postsList) return;
    
    console.log('💬 Rendering community posts');
    postsList.innerHTML = '';
    
    APP_DATA.communityPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        const avatarEmoji = post.author.includes('Sunita') ? '👩‍🍳' : '👨‍🍳';
        
        postCard.innerHTML = `
            <div class="post-header">
                <div class="author-info">
                    <div class="author-avatar">${avatarEmoji}</div>
                    <div>
                        <h4>${post.author}</h4>
                        <p>${post.business} • ${post.location}</p>
                    </div>
                </div>
                <div class="post-time">${post.time}</div>
            </div>
            <div class="post-content">
                <p>${post.post}</p>
            </div>
            <div class="post-actions">
                <button class="post-action" data-action="like-post">👍 ${post.likes} likes</button>
                <button class="post-action" data-action="reply-post">💬 Reply</button>
                <button class="post-action" data-action="share-post">🔄 Share</button>
            </div>
        `;
        
        postsList.appendChild(postCard);
    });
}

function updateGroupBuyProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const percentage = (65 / 100) * 100; // Demo data
        progressFill.style.width = `${percentage}%`;
    }
}

// Event Handlers
function handleAction(action, params) {
    console.log(`🎬 Handling action: ${action}`, params);
    
    switch(action) {
        case 'add-to-cart':
            if (params.productId) {
                const product = APP_DATA.products.find(p => p.id == params.productId);
                if (product) {
                    cart.push(product);
                    showNotification(`${product.name} added to cart!`);
                }
            }
            break;
        case 'compare':
            if (params.productId) {
                const product = APP_DATA.products.find(p => p.id == params.productId);
                if (product) {
                    showNotification(`Comparing suppliers for ${product.name}...`);
                }
            }
            break;
        case 'reorder':
            if (params.productName) {
                showNotification(`Reorder initiated for ${params.productName}!`);
            }
            break;
        case 'view-products':
            if (params.supplierId) {
                const supplier = APP_DATA.suppliers.find(s => s.id == params.supplierId);
                if (supplier) {
                    showNotification(`Viewing products from ${supplier.name}`);
                }
            }
            break;
        case 'contact-supplier':
            if (params.supplierId) {
                const supplier = APP_DATA.suppliers.find(s => s.id == params.supplierId);
                if (supplier) {
                    showNotification(`Contacting ${supplier.name} - Phone: +91-XXXXXXXXXX`);
                }
            }
            break;
        case 'like-post':
            showNotification('Post liked! 👍');
            break;
        case 'reply-post':
            showNotification('Reply feature would open here!');
            break;
        case 'share-post':
            showNotification('Post shared to your network!');
            break;
    }
}

// Main App Initialization
function initializeMainApp() {
    console.log('🏠 Initializing main application features...');
    
    // Navigation
    const navItems = document.querySelectorAll('.nav__item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            if (sectionId) {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                showSection(sectionId);
            }
        });
    });
    
    // Profile dropdown
    const profileTrigger = document.getElementById('profile-trigger');
    const profileMenu = document.getElementById('profile-menu');
    
    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileMenu.classList.add('hidden');
            }
        });
    }
    
    // Profile actions
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const viewProfileBtn = document.getElementById('view-profile');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            showNotification(`Profile: ${currentUser.name}\nBusiness: ${currentUser.businessName}\nLocation: ${currentUser.location}\nSpecialty: ${currentUser.specialty}`);
            profileMenu.classList.add('hidden');
        });
    }
    
    const settingsBtn = document.getElementById('settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showNotification('Settings panel would open here!');
            profileMenu.classList.add('hidden');
        });
    }
    
    // Quick actions
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-action');
            
            switch(action) {
                case 'place-order':
                    navigateToSection('marketplace', 'Navigated to Marketplace');
                    break;
                case 'check-prices':
                    navigateToSection('marketplace', 'Navigated to Marketplace for price checking');
                    break;
                case 'contact-supplier':
                    navigateToSection('suppliers', 'Navigated to Suppliers');
                    break;
                case 'join-group':
                    navigateToSection('group-buying', 'Navigated to Group Buying');
                    break;
            }
        });
    });
    
    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const category = btn.getAttribute('data-category');
            
            let filteredProducts;
            if (category === 'all') {
                filteredProducts = APP_DATA.products;
            } else {
                filteredProducts = APP_DATA.products.filter(product => product.category === category);
            }
            
            categoryBtns.forEach(cat => cat.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(filteredProducts);
            currentCategory = category;
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar .form-control');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (currentSection !== 'marketplace') return;
            
            let filteredProducts = APP_DATA.products;
            
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm)
                );
            }
            
            if (currentCategory !== 'all') {
                filteredProducts = filteredProducts.filter(product => 
                    product.category === currentCategory
                );
            }
            
            renderProducts(filteredProducts);
        });
    }
    
    // Global click handler for actions
    document.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action) {
            e.preventDefault();
            const productId = e.target.getAttribute('data-product-id');
            const supplierId = e.target.getAttribute('data-supplier-id');
            const productName = e.target.getAttribute('data-product');
            
            handleAction(action, { productId, supplierId, productName });
        }
        
        // Handle specific buttons
        const buttonText = e.target.textContent;
        if (buttonText === 'Order Now') {
            e.preventDefault();
            navigateToSection('marketplace', 'Redirected to marketplace for tomatoes!');
        } else if (buttonText === 'Join Group') {
            e.preventDefault();
            showNotification('Joined group buy for potatoes! You will be notified when the order is ready.');
        } else if (buttonText === 'Create Group Buy') {
            e.preventDefault();
            showNotification('Create Group Buy form would open here!');
        } else if (buttonText === 'New Post') {
            e.preventDefault();
            showNotification('New post form would open here!');
        }
    });
    
    console.log('✅ Main application initialized');
}

// DOM Ready Function
function initializeApplication() {
    console.log('🌟 Initializing GalliBites.AI Application');
    
    // Check for existing session first
    if (checkExistingSession()) {
        return; // User is already logged in
    }
    
    // Initialize authentication buttons
    console.log('🔐 Setting up authentication handlers...');
    
    // Landing page - Demo login
    const demoLoginBtn = document.getElementById('demo-login');
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎮 Demo login clicked');
            
            const demoUser = APP_DATA.sampleVendors[0];
            authenticateUser(demoUser, true);
        });
        console.log('✅ Demo login button initialized');
    } else {
        console.log('❌ Demo login button not found');
    }
    
    // Landing page - Go to login
    const gotoLoginBtn = document.getElementById('goto-login');
    if (gotoLoginBtn) {
        gotoLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Login button clicked');
            showAuthPage('login-page');
        });
        console.log('✅ Login button initialized');
    } else {
        console.log('❌ Login button not found');
    }
    
    // Landing page - Go to signup
    const gotoSignupBtn = document.getElementById('goto-signup');
    if (gotoSignupBtn) {
        gotoSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Signup button clicked');
            showAuthPage('signup-page');
        });
        console.log('✅ Signup button initialized');
    } else {
        console.log('❌ Signup button not found');
    }
    
    // Back buttons
    const backBtns = document.querySelectorAll('#back-to-landing, #back-to-landing-signup');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthPage('landing-page');
        });
    });
    
    // Switch between login/signup
    const switchToSignup = document.getElementById('switch-to-signup');
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthPage('signup-page');
        });
    }
    
    const switchToLogin = document.getElementById('switch-to-login');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthPage('login-page');
        });
    }
    
    // Demo account clicks
    const demoAccounts = document.querySelectorAll('.demo-account');
    demoAccounts.forEach(account => {
        account.addEventListener('click', () => {
            const email = account.getAttribute('data-email');
            const password = account.getAttribute('data-password');
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            
            if (emailInput && passwordInput) {
                emailInput.value = email;
                passwordInput.value = password;
                showNotification('Demo credentials filled! Click Login to continue.');
            }
        });
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('🔑 Login form submitted');
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const rememberMeInput = document.getElementById('remember-me');
            
            if (!emailInput || !passwordInput) {
                showNotification('Form fields not found!', 'error');
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeInput ? rememberMeInput.checked : false;
            
            if (!email || !password) {
                showNotification('Please enter both email/phone and password!', 'error');
                return;
            }
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            setTimeout(() => {
                const user = APP_DATA.sampleVendors.find(vendor => 
                    (vendor.email === email || vendor.phone === email) && vendor.password === password
                );
                
                if (user) {
                    console.log('✅ Login successful:', user.name);
                    authenticateUser(user, rememberMe);
                } else {
                    showNotification('Invalid credentials. Try: raju.samosa@gmail.com / password123', 'error');
                    setButtonLoading(submitBtn, false);
                }
            }, 1000);
        });
        console.log('✅ Login form initialized');
    }
    
    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Signup form submitted');
            
            // Get form data
            const name = document.getElementById('signup-name')?.value.trim() || '';
            const businessName = document.getElementById('signup-business')?.value.trim() || '';
            const phone = document.getElementById('signup-phone')?.value.trim() || '';
            const email = document.getElementById('signup-email')?.value.trim() || '';
            const location = document.getElementById('signup-location')?.value.trim() || '';
            const specialty = document.getElementById('signup-specialty')?.value || '';
            const password = document.getElementById('signup-password')?.value || '';
            const confirmPassword = document.getElementById('signup-confirm-password')?.value || '';
            const termsAccepted = document.getElementById('terms-accept')?.checked || false;
            
            // Validate
            const errors = [];
            if (!name) errors.push('Full name is required');
            if (!businessName) errors.push('Business name is required');
            if (!phone) errors.push('Phone number is required');
            if (!email) errors.push('Email is required');
            if (!location) errors.push('Location is required');
            if (!specialty) errors.push('Food specialty is required');
            if (!password) errors.push('Password is required');
            if (!confirmPassword) errors.push('Please confirm your password');
            if (!termsAccepted) errors.push('Please accept the terms and conditions');
            
            if (password !== confirmPassword) {
                errors.push('Passwords do not match');
            }
            
            if (APP_DATA.sampleVendors.find(user => user.email === email)) {
                errors.push('Email already registered. Please login instead.');
            }
            
            if (errors.length > 0) {
                showNotification(errors.join('\n'), 'error');
                return;
            }
            
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true);
            
            setTimeout(() => {
                const newUser = {
                    id: APP_DATA.sampleVendors.length + 1,
                    name,
                    businessName,
                    phone,
                    email,
                    location,
                    specialty,
                    fssaiLicense: document.getElementById('signup-fssai')?.value.trim() || '',
                    password
                };
                
                APP_DATA.sampleVendors.push(newUser);
                console.log('✅ Signup successful:', newUser.name);
                showNotification('Account created successfully! Welcome to GalliBites.AI 🎉');
                
                setTimeout(() => {
                    authenticateUser(newUser, true);
                }, 1500);
            }, 1500);
        });
        console.log('✅ Signup form initialized');
    }
    
    console.log('✅ Application initialization complete');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}