  <script>
    import {Sparkles} from 'lucide-svelte'
    
  </script>
  <div class="hero py-24">
    <div class="hero-content text-center">
      <div class="max-w-lg">
        <h1 class="text-7xl font-bold">Happy Birthday Song Generator</h1>
        <form action="/generator" method="POST" class="space-y-4">
          <label for="name" class="block">
            <span class="block">Enter your name</span>
            <input type="text" placeholder="Enter your name" name="name" class="input input-lg input-error border-2 input-bordered w-full max-w-xs"/>

          </label>
          <button class="btn btn-error btn-lg"> <Sparkles /> Create Song</button>

         </form>

      </div>
    </div>
  </div>
  


  