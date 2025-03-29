'use client';

export default function ScrollToListingsButton() {
  const handleScroll = () => {
    const listingsSection = document.getElementById('listings-section');
    if (listingsSection) {
      const headerOffset = 100; // Adjust this value based on your header height
      const elementPosition = listingsSection.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Start Searching
    </button>
  );
} 