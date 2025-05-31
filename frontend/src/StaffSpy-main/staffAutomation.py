# linkedin_job_scraper.py

import feedparser
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# ----------- RSS SCRAPER -----------
def get_jobs_rss(keyword="software engineer", location="London"):
    keyword = keyword.replace(" ", "%20")
    location = location.replace(" ", "%20")
    url = f"https://www.linkedin.com/jobs-guest/jobs/rss/?keywords={keyword}&location={location}"

    print(f"📡 Fetching RSS feed: {url}")
    feed = feedparser.parse(url)
    jobs = []

    for entry in feed.entries:
        jobs.append({
            "title": entry.title,
            "company": entry.summary.split('·')[0].strip(),
            "link": entry.link,
            "published": entry.published
        })

    return jobs


# ----------- SELENIUM SCRAPER -----------
def scrape_jobs_with_selenium(keyword="software engineer", location="London"):
    keyword = keyword.replace(" ", "%20")
    location = location.replace(" ", "%20")
    url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}"

    print(f"🕷️  Launching Selenium for URL: {url}")
    options = webdriver.ChromeOptions()
    options.add_argument("--user-data-dir=chrome-data")  # Keeps session logged in
    driver = webdriver.Chrome(options=options)

    driver.get(url)
    time.sleep(5)  # Wait for page to load

    jobs = []
    try:
        job_cards = driver.find_elements(By.CLASS_NAME, "base-search-card__info")
        for card in job_cards[:10]:  # limit to first 10 jobs
            try:
                title = card.find_element(By.CLASS_NAME, "base-search-card__title").text.strip()
                company = card.find_element(By.CLASS_NAME, "base-search-card__subtitle").text.strip()
                link = card.find_element(By.TAG_NAME, "a").get_attribute("href")
                jobs.append({
                    "title": title,
                    "company": company,
                    "link": link
                })
            except Exception:
                continue
    except Exception as e:
        print(f"❌ Error during Selenium scraping: {e}")
    finally:
        driver.quit()

    return jobs


# ----------- MAIN COMBINED FUNCTION -----------
def fetch_jobs_combined(keyword, location):
    jobs = get_jobs_rss(keyword, location)
    if not jobs:
        print("⚠️  RSS feed returned nothing. Falling back to Selenium.")
        jobs = scrape_jobs_with_selenium(keyword, location)
    else:
        print(f"✅ RSS feed returned {len(jobs)} results.")
    return jobs


# ----------- RUNNING THE SCRAPER -----------
if __name__ == "__main__":
    keyword = input("🔍 Enter job title (e.g., frontend developer): ").strip()
    location = input("🌍 Enter location (e.g., Mumbai): ").strip()

    jobs = fetch_jobs_combined(keyword, location)

    if jobs:
        print(f"\n📋 Found {len(jobs)} job(s):\n")
        for i, job in enumerate(jobs, start=1):
            print(f"{i}. {job['title']} at {job['company']}")
            print(f"   🔗 {job['link']}")
            print(f"   📅 {job.get('published', 'N/A')}")
            print("-" * 50)
    else:
        print("❌ No jobs found.")
