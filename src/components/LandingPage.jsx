import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  // scroll helper
  const goToDashboard = () => {
    const section = document.getElementById('dashboard-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fbf8]">
      <div className="max-w-5xl w-full">
        {/* Top animations for content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#1a2b1b] mb-6 leading-tight">
            Manage Student Records
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A simple and efficient system to view, add, edit, and delete student records in one place.
          </p>

          <Button 
            onClick={goToDashboard}
            className="h-14 px-10 text-lg font-semibold bg-[#A5C89E] text-[#1a2b1b] hover:bg-[#D8E983] transition-all rounded-xl"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Feature cards below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <Card className="border-none shadow-sm bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl text-[#1a2b1b]">View Students</CardTitle>
            </CardHeader>
            <CardDescription className="text-gray-500 leading-relaxed">
              Easily browse and access all registered students with clear and structured information.
            </CardDescription>
          </Card>

          <Card className="border-none shadow-sm bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl text-[#1a2b1b]">Edit & Delete</CardTitle>
            </CardHeader>
            <CardDescription className="text-gray-500 leading-relaxed">
              Update student details or remove records when needed with minimal effort.
            </CardDescription>
          </Card>

          <Card className="border-none shadow-sm bg-white p-6 rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl text-[#1a2b1b]">Add New Students</CardTitle>
            </CardHeader>
            <CardDescription className="text-gray-500 leading-relaxed">
              Quickly enroll new students using a clean and straightforward form.
            </CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;
