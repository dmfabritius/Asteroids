using System;

namespace Asteroids {
#if WINDOWS || LINUX

    public static class Program {

        public static readonly Random random = new Random();

        [System.STAThread]
        static void Main() {
            Astro.Instance.Run();
        }
    }

#endif
}
