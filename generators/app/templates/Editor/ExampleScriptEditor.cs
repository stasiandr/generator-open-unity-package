using UnityEditor;
using UnityEngine;

namespace Editor
{
    [CustomEditor(typeof(ExampleScript))]
    public class ExampleScriptEditor : UnityEditor.Editor
    {
        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();

            if (GUILayout.Button("Press me"))
            {
                Debug.Log(ExampleScript.ExampleSum(2, 2));
            }
        }
    }
}