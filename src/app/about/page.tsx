export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <p className="text-gray-300 text-lg mb-6">
              I&apos;m a passionate videographer and content creator based in Nigeria, specializing in crafting visual narratives that resonate.
            </p>
            <p className="text-gray-400 mb-8">
              With over 8 years of experience in the industry, I&apos;ve had the privilege of working with brands, artists, and storytellers across the globe. My approach combines technical expertise with artistic vision to create content that doesn&apos;t just look good — it feels right.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎬', title: 'Cinematography' },
                { icon: '✂️', title: 'Editing' },
                { icon: '🎨', title: 'Color Grading' },
                { icon: '📱', title: 'Social Content' },
                { icon: '🎵', title: 'Sound Design' },
                { icon: '🚀', title: 'Motion Graphics' },
              ].map((skill) => (
                <div key={skill.title} className="flex items-center space-x-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <span className="text-sm font-medium">{skill.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { number: '200+', label: 'Projects Completed' },
              { number: '50+', label: 'Happy Clients' },
              { number: '10M+', label: 'Views Generated' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Clients & Collaborators</h2>
          <p className="text-gray-400 text-lg">Brands I&apos;ve had the pleasure of working with</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {['DSTV', 'MTN', 'AIRTEL', 'GLO', 'ZENITH BANK', 'GTBank', 'FIRST BANK', 'SHOWMAX'].map((client) => (
            <div
              key={client}
              className="flex items-center justify-center h-20 bg-surface rounded-lg border border-surface-light hover:border-accent/30 transition-colors"
            >
              <span className="text-xl font-bold text-gray-400 hover:text-accent transition-colors">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
