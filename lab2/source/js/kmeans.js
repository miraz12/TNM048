/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself! 

    var centroids = [];
    var dimensions = Object.keys(data[0]).length;
    for (var i = 0; i < k; i++) {
        var centroid = [];
        for (var j = 0; j < dimensions; j++) {
            centroid.push(Math.random())
        }
        centroids.push(centroid);
    }

    var result = {
        assignments: []
    };
    result.assignments.length = data.length;

    for (var i = 0; i < data.length; i++) {
        var closestCentroid = -1;
        var closestCentroidDistance = Number.MAX_SAFE_INTEGER;
        for (var j = 0; j < k; j++) {
            var distance = euclideanDistance(Object.values(data[i]), centroids[j]);
            if (distance < closestCentroidDistance) {
                closestCentroidDistance = distance;
                closestCentroid = j;
            }
        }
    }

    function euclideanDistance(a, b) {
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            result += Math.abs(a[i] - b[i]) * Math.abs(a[i] - b[i]);
        }
        return Math.sqrt(result)
    }

    return centroids;
};


