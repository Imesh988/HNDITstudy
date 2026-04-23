import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Secure Authentication System
          </h1>
          <p className="text-xl mb-8">
            Built with Next.js 14, Firebase, and Tailwind CSS
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" className="w-auto px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="w-auto px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: '🔐 Email Verification',
    description: 'Secure email verification before account access',
  },
  {
    title: '🛡️ Strong Password Policy',
    description: 'Enforced password strength requirements',
  },
  {
    title: '🚪 Protected Routes',
    description: 'Middleware-based route protection',
  },
];