docker build -t rosnaldinho20/esquentak8s .
docker run --rm -p 8080:8080 rosnaldinho20/esquentak8s
docker push rosnaldinho20/esquentak8s

kind create cluster —name=esquenta-k8s
kubectl cluster-info --context kind-esquenta-k8s //run cluster
kubectl get nodes // show nodes
kubectl apply -f k8s/pod.yaml //create pod
kubectl get pods
kubectl port-forward pod/webserver 8080:8080 // mapping pod port with host port
kubectl delete pod webserver
kubectl apply -f k8s/replicaset.yaml
kubectl get replicaset
kubectl port-forward pod/<pod_name> 8080:80
kubectl delete replicaset webserver
kubectl get svc // get services

