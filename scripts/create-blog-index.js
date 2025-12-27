const fs = require('fs');
const path = require('path');

const postsDataPath = path.join(__dirname, 'blog-posts.json');

if (!fs.existsSync(postsDataPath)) {
  console.error('❌ blog-posts.json not found!');
  console.log('Run: node scripts/mdx-to-html.js first');
  process.exit(1);
}

const blogPosts = JSON.parse(fs.readFileSync(postsDataPath, 'utf-8'));

// Sort by date (newest first)
blogPosts.sort((a, b) => {
  return new Date(b.date) - new Date(a.date);
});

// Generate blog cards HTML
const blogCardsHtml = blogPosts.map(post => `
                <article class="blog-card">
                    <div class="blog-card-content">
                        <h3><a href="/blog/${post.slug}">${post.title}</a></h3>
                        <p class="blog-card-excerpt">${post.description}</p>
                        <div class="blog-card-meta">
                            <span class="blog-date">${post.date}</span>
                            <a href="/blog/${post.slug}" class="read-more">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
`).join('');

const blogIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    
    <!-- SEO Meta Tags -->
    <title>Blog | Wolfgramm Holdings - Māori Leadership, AI & Te Tiriti Insights</title>
    <meta name="description" content="Explore insights on Māori cultural capability, Te Tiriti o Waitangi, AI innovation, and workplace transformation from Wolfgramm Holdings.">
    <meta name="keywords" content="Māori leadership blog, Te Tiriti insights, AI innovation NZ, cultural capability, workplace inclusion">
    <meta name="author" content="Wolfgramm Holdings">
    <meta name="robots" content="all">
    
    <!-- Favicon -->
    <link rel="icon" href="/assets/images/logo/favicon.png">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/components.css">
    <link rel="stylesheet" href="/assets/css/responsive.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        .blog-hero {
            background: linear-gradient(135deg, #d8aa6d 0%, #c09855 100%);
            padding: 100px 20px 60px;
            text-align: center;
        }
        
        .blog-hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #fff;
        }
        
        .blog-hero p {
            font-size: 1.2rem;
            color: #fff;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        .blog-search-container {
            max-width: 600px;
            margin: 0 auto;
            position: relative;
        }
        
        .blog-search-input {
            width: 100%;
            padding: 15px 50px 15px 20px;
            font-size: 1rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            background: rgba(255, 255, 255, 0.95);
            color: #000;
            transition: all 0.3s ease;
        }
        
        .blog-search-input:focus {
            outline: none;
            border-color: #fff;
            background: #fff;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }
        
        .blog-search-input::placeholder {
            color: #999;
        }
        
        .blog-search-icon {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #d8aa6d;
            font-size: 1.2rem;
            pointer-events: none;
        }
        
        .search-results-count {
            text-align: center;
            margin: 20px 0;
            color: #666;
            font-size: 1rem;
        }
        
        .no-results {
            text-align: center;
            padding: 60px 20px;
            color: #999;
            font-size: 1.2rem;
        }
        
        .blog-grid {
            max-width: 1200px;
            margin: 60px auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .blog-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            border: 1px solid #eee;
        }
        
        .blog-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        
        .blog-card-content {
            padding: 2rem;
        }
        
        .blog-card h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            line-height: 1.3;
        }
        
        .blog-card h3 a {
            color: #000;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .blog-card h3 a:hover {
            color: #d8aa6d;
        }
        
        .blog-card-excerpt {
            color: #666;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .blog-card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        
        .blog-date {
            color: #999;
            font-size: 0.9rem;
        }
        
        .read-more {
            color: #d8aa6d;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .read-more:hover {
            color: #c09855;
            gap: 0.75rem;
        }
        
        @media (max-width: 768px) {
            .blog-hero h1 {
                font-size: 2rem;
            }
            
            .blog-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }
    </style>
</head>
<body class="overflow-x-hidden">
    <!-- Header Section -->
    <header id="website-header" class="site-header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <!-- Left Navigation -->
                    <div>
                        <ul class="nav-menu">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li class="has-dropdown">
                                <a href="/services">Services</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/services">Our Services</a></li>
                                    <li><a href="/workshops">Workshops</a></li>
                                    <li><a href="/ai-adoption">AI Adoption</a></li>
                                    <li><a href="/training">Training</a></li>
                                </ul>
                            </li>
                            <li class="active"><a href="/blog">Blog</a></li>
                            <li class="has-dropdown">
                                <a href="/contact">Contact</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/contact">Contact Us</a></li>
                                    <li><a href="/faq">FAQ</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Logo (Center) -->
                    <div class="logo">
                        <a href="/">
                            <img src="/assets/images/logo/logo.png" alt="Wolfgramm Holdings">
                        </a>
                    </div>
                    
                    <!-- Right Side (Social + CTA) -->
                    <div class="nav-right">
                        <!-- Social Media Links -->
                        <ul class="nav-social">
                            <li><a href="https://facebook.com/profile.php?id=61570941830685" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="https://linkedin.com/company/wolfgramm-holdings" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a></li>
                            <li><a href="https://instagram.com/wolfgrammholdings" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a></li>
                            <li><a href="https://tiktok.com/@wolfgramm.holdings" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a></li>
                            <li><a href="https://youtube.com/@WolfgrammHoldings" target="_blank" aria-label="YouTube"><i class="fab fa-youtube"></i></a></li>
                        </ul>
                        
                        <!-- CTA Button -->
                        <div class="nav-cta">
                            <a href="/contact" class="btn btn-primary btn-lg">Book a Free Session</a>
                        </div>
                        
                        <!-- Mobile Menu Toggle -->
                        <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
                            <span class="hamburger"></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <!-- Blog Hero -->
    <section class="blog-hero">
        <h1>Blog</h1>
        <p>Insights on Māori leadership, cultural capability, Te Tiriti, and AI innovation</p>
        
        <!-- Search Bar -->
        <div class="blog-search-container">
            <input 
                type="text" 
                id="blogSearch" 
                class="blog-search-input" 
                placeholder="Search articles by title, topic, or keyword..."
                aria-label="Search blog posts"
            >
            <i class="fas fa-search blog-search-icon"></i>
        </div>
    </section>

    <!-- Search Results Count -->
    <div id="searchResultsCount" class="search-results-count" style="display: none;"></div>

    <!-- Blog Grid -->
    <main>
        <div class="blog-grid" id="blogGrid">
${blogCardsHtml}
        </div>
    </main>

    <!-- Footer -->
    <footer id="website-footer" class="site-footer site-footer-white">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <p class="footer-tagline">Growing Better People</p>
                    <p class="footer-contact">
                        <a href="mailto:info@wgholdings.co.nz">info@wgholdings.co.nz</a>
                    </p>
                </div>
                <nav class="footer-nav" role="navigation" aria-label="Footer navigation">
                    <ul class="footer-menu">
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/workshops">Workshops</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
                <div class="footer-bottom">
                    <p>&copy; 2025 Wolfgramm Holdings Ltd</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="/assets/js/utils.js"></script>
    <script src="/assets/js/main.js"></script>
    
    <script>
        // Blog Search Functionality
        const blogSearch = document.getElementById('blogSearch');
        const blogGrid = document.getElementById('blogGrid');
        const searchResultsCount = document.getElementById('searchResultsCount');
        
        // Store all blog cards data
        const allBlogPosts = Array.from(document.querySelectorAll('.blog-card')).map(card => ({
            element: card.cloneNode(true),
            title: card.querySelector('h3').textContent.toLowerCase(),
            excerpt: card.querySelector('.blog-card-excerpt').textContent.toLowerCase(),
            date: card.querySelector('.blog-date').textContent
        }));
        
        // Search function
        function performSearch() {
            const searchTerm = blogSearch.value.toLowerCase().trim();
            
            // Clear current grid
            blogGrid.innerHTML = '';
            
            if (searchTerm === '') {
                // Show all posts if search is empty
                allBlogPosts.forEach(post => {
                    blogGrid.appendChild(post.element.cloneNode(true));
                });
                searchResultsCount.style.display = 'none';
                return;
            }
            
            // Filter posts based on search term
            const filteredPosts = allBlogPosts.filter(post => 
                post.title.includes(searchTerm) || 
                post.excerpt.includes(searchTerm)
            );
            
            if (filteredPosts.length === 0) {
                // Show no results message
                blogGrid.innerHTML = '<div class="no-results"><i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i><p>No articles found matching your search.</p><p style="font-size: 1rem; margin-top: 0.5rem;">Try different keywords or <a href="/blog" style="color: #d8aa6d; text-decoration: underline;">view all articles</a></p></div>';
                searchResultsCount.textContent = 'No results found';
                searchResultsCount.style.display = 'block';
            } else {
                // Display filtered posts
                filteredPosts.forEach(post => {
                    blogGrid.appendChild(post.element.cloneNode(true));
                });
                
                // Show results count
                const resultText = filteredPosts.length === 1 
                    ? '1 article found' 
                    : \`\${filteredPosts.length} articles found\`;
                searchResultsCount.textContent = resultText;
                searchResultsCount.style.display = 'block';
            }
        }
        
        // Add event listeners
        blogSearch.addEventListener('input', performSearch);
        
        // Optional: Clear search on escape key
        blogSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                blogSearch.value = '';
                performSearch();
            }
        });
    </script>
</body>
</html>`;

// Write blog index
const blogDir = path.join(__dirname, '..', 'blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml);

console.log(`✅ Blog index created with ${blogPosts.length} posts!`);
console.log('Location: blog/index.html');
console.log('\nView it at: http://localhost:8000/blog (or your local server)');

