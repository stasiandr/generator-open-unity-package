using System.Collections;
using NUnit.Framework;
using UnityEngine.TestTools;

namespace Tests.Editor
{
    public class ExampleEditorTest
    {
        [Test]
        public void ExampleEditorTestSimplePasses()
        {
            Assert.AreEqual(4, ExampleScript.ExampleSum(2, 2));
        }
    }
}