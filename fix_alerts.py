import re, os

files = [
    r'c:\Users\Acer\Desktop\Foodwaste\client\foodwaste\src\pages\CreateDonation.jsx',
    r'c:\Users\Acer\Desktop\Foodwaste\client\foodwaste\src\pages\CorporatePortal.jsx',
]

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    has_toast = 'react-hot-toast' in content

    # Replace all alert() with toast
    content = re.sub(
        r"alert\('Pickup Scheduled successfully!'\)",
        "toast.success('Pickup Scheduled successfully!')",
        content
    )
    content = re.sub(
        r"alert\('Settings saved successfully!'\)",
        "toast.success('Settings saved successfully!')",
        content
    )
    content = re.sub(
        r'alert\("Please select a Food Category and write a Description first\."\)',
        'toast.error("Please select a Food Category and write a Description first.")',
        content
    )
    content = re.sub(
        r'alert\("Failed to get AI suggestions\."\)',
        'toast.error("Failed to get AI suggestions.")',
        content
    )
    content = re.sub(
        r"alert\('Please complete all food safety checks'\)",
        "toast.error('Please complete all food safety checks')",
        content
    )
    content = re.sub(
        r"alert\('Error finding matches\. Please try again\.'\)",
        "toast.error('Error finding matches. Please try again.')",
        content
    )
    content = re.sub(
        r'alert\(`AI predicted expiry.*?\);',
        'toast.success("AI predicted expiry suggestion applied!");',
        content
    )

    # Add toast import
    if not has_toast and 'toast.' in content:
        content = "import toast from 'react-hot-toast';\n" + content

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Fixed: {os.path.basename(fp)}')

print('Done!')
