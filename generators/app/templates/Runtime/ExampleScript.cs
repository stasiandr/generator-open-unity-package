using UnityEngine;

public class ExampleScript : MonoBehaviour
{
    private void Start()
    {
        Debug.Log($"2 + 2 ={ExampleSum(2, 2)}");
    }

    public static int ExampleSum(int a, int b)
    {
        return a + b;
    }
}
