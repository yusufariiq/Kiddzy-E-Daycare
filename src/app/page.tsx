import Navbar from "@/components/common/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EFEEEA]">
      <Navbar />
      <div className="mt-20 space-y-32">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#273F4F]">Section {i + 1}</h2>
              <p className="mt-4 text-[#273F4F]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies,
                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
              </p>
            </div>
          ))}
        </div>
    </main>
  );
}
