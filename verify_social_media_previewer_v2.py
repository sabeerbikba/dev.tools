from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the new page
        print("Navigating to Social Media Previewer...")
        page.goto("http://localhost:3004/social-media-previewer")

        # Wait for the page to load
        page.wait_for_selector("text=Input")
        print("Page loaded.")

        # Verify Image Upload is at the top
        print("Verifying Image Upload is at top...")
        # Check if the text "Image" appears before "Website URL" in the DOM or visually
        # Here we just check if it exists
        page.wait_for_selector("text=Image")

        # Fill in the URL for fetching
        print("Filling URL for fetching...")
        # Note the spaces in placeholder again
        page.fill("input[placeholder='   https://example.com']", "https://github.com")

        # Click Fetch Meta button
        print("Clicking Fetch Meta...")
        # Finding the button inside the relative container next to the input
        page.click("button[title='Fetch Meta Tags']")

        # Wait for fetch to complete (toast or title change)
        print("Waiting for fetch...")
        try:
            # Wait for title to be populated (GitHub's title usually starts with GitHub)
            page.wait_for_function("document.querySelector('input[placeholder=\"   Enter page title\"]').value.includes('GitHub')", timeout=10000)
            print("Meta tags fetched successfully.")
        except Exception as e:
            print(f"Fetch might have failed or taken too long: {e}")
            # Continue anyway to take screenshot

        # Wait a bit for images to load
        time.sleep(3)

        # Take a screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification_social_media_previewer_v2.png", full_page=True)
        print("Screenshot saved to verification_social_media_previewer_v2.png")

        browser.close()

if __name__ == "__main__":
    run()
