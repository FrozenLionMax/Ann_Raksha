import React, { useState } from 'react';
import { Sparkles, ChefHat, Loader, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function AiRecipes() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setError('');
    setRecipe('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/recipe', {
        ingredients
      });
      setRecipe(response.data.recipe);
    } catch (err) {
      console.error(err);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6F2] to-[#FAFAFA] pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2F5D50] to-[#7BAE7F] rounded-2xl flex items-center justify-center transform rotate-3">
              <ChefHat className="w-8 h-8 text-white -rotate-3" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Smart Recipe Generator</h1>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
            Got leftover ingredients? Don't throw them away! Our AI chef will suggest creative and delicious ways to use them up.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7BAE7F]" /> Your Ingredients
              </h2>
              <form onSubmit={handleGenerate}>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., 2 overripe bananas, half a carton of milk, and some stale bread..."
                  rows="6"
                  className="w-full px-4 py-4 rounded-xl border border-[#EDE6DB] focus:outline-none focus:ring-2 focus:ring-[#7BAE7F] text-[#1F2937] mb-6 resize-none bg-[#FAFAFA]"
                ></textarea>
                
                <button
                  type="submit"
                  disabled={loading || !ingredients.trim()}
                  className="w-full bg-[#2F5D50] text-white py-4 rounded-xl font-semibold hover:bg-[#1F4D40] transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#2F5D50]/20"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Cooking ideas...
                    </>
                  ) : (
                    <>
                      Generate Recipes
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
              {error && <p className="text-[#FF4D4D] mt-4 text-sm font-medium">{error}</p>}
            </div>
          </div>

          {/* Result Section */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-[#EDE6DB] shadow-sm min-h-[400px]">
              {recipe ? (
                <div className="prose prose-green max-w-none">
                  {recipe.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-[#1F2937] mt-6 mb-4">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-bold text-[#2F5D50] mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={index} className="text-[#4B5563] ml-4 mb-1">{line.replace('- ', '')}</li>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={index} className="font-bold text-[#1F2937] mt-4">{line.replace(/\*\*/g, '')}</p>
                    }
                    return line.trim() ? <p key={index} className="text-[#4B5563] mb-4">{line.replace(/\*\*/g, '')}</p> : <br key={index} />;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <ChefHat className="w-16 h-16 text-[#7BAE7F] mb-4" />
                  <p className="text-lg font-medium text-[#1F2937]">Ready to cook!</p>
                  <p className="text-sm text-[#4B5563]">Enter your ingredients to see AI suggestions here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
