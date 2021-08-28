
    using NUnit.Framework;
    using UnityEngine;

    namespace Tests.Runtime
    {
        public class ExampleTest
        {
            [UnityEngine.TestTools.UnityTest]
            public System.Collections.IEnumerator ExampleTestWithEnumeratorPasses()
            {
                var result = ExampleScript.ExampleSum(2, 2);
                
                yield return new WaitForSeconds(1);

                Assert.AreEqual(4, result);
            }
        }
    }
