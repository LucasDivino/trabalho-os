from django.shortcuts import render
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.views import APIView
from user.serializer import UserSerializer
from user.models import Lugar
from django.http import JsonResponse
from server.utils.generic import genericSerializer
from geopy.distance import distance
import pyomo.environ as pyEnv

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class OptimalPath(APIView):

    def inicializa_vetor(self, h):
        return [0 for y in range(h)]

    def inicializa_matriz(self, w, h):
        return [[0 for x in range(w)] for y in range(h)]

    def matriz_distancia(self, lugares, coordenadaMotorista, destino):
        distancias_motorista = self.inicializa_vetor(len(lugares))
        distancias_cliente = self.inicializa_matriz(len(lugares), len(lugares))
        distancias_destino = self.inicializa_vetor(len(lugares))
        for i in range(0, len(lugares)):
            distancias_motorista[i] = distance(coordenadaMotorista, (lugares[i].latitude, lugares[i].longitude)).m 
            distancias_destino[i] = distance((lugares[i].latitude, lugares[i].longitude), (destino[0].latitude, destino[0].longitude)).m
            for j in range(0, len(lugares)):
                if lugares[j] != lugares[i]:
                    distancias_cliente[i][j] = distance((lugares[i].latitude, lugares[i].longitude), (lugares[j].latitude, lugares[j].longitude)).m

        return {'distancias_motorista': distancias_motorista, 'distancias_cliente': distancias_cliente, 'distancias_destino': distancias_destino}

    def get(self, request):
        user_id = self.request.query_params.get('user_id')
        lugares = Lugar.objects.filter(user_id=user_id, destino=False)
        destino = Lugar.objects.filter(user_id=user_id, destino=True)

        n = len(lugares)
        
        coordenadaMotorista = (-19.920, -43.920)

        distancias = self.matriz_distancia(lugares, coordenadaMotorista, destino)

        model = pyEnv.ConcreteModel()

        model.Clientes = pyEnv.RangeSet(n)
        #Index for the dummy variable u
        model.U = pyEnv.RangeSet(2, n)

        model.xClientes = pyEnv.Var(model.Clientes, model.Clientes, within=pyEnv.Binary)
        model.xMotorista = pyEnv.Var(model.Clientes, within=pyEnv.Binary)
        model.xDestino = pyEnv.Var(model.Clientes, within=pyEnv.Binary)

        #Dummy variable ui
        model.u = pyEnv.Var(model.Clientes, within=pyEnv.NonNegativeIntegers,bounds=(0, n-1))

        model.dClientes = pyEnv.Param(model.Clientes, model.Clientes, initialize=lambda model, i, j: distancias['distancias_cliente'][i-1][j-1])
        model.dMotorista = pyEnv.Param(model.Clientes, initialize=lambda model, i: distancias['distancias_motorista'][i-1])
        model.dDestino = pyEnv.Param(model.Clientes, initialize=lambda model, i: distancias['distancias_destino'][i-1])

        def media_caminho(model):
            return (sum(model.xClientes[i,j] * model.dClientes[i,j] for i in model.Clientes for j in model.Clientes) + sum(model.xDestino[i] * model.dDestino[i] for i in model.Clientes))/n

        def menor_caminho(model):
            return (sum(model.xClientes[i,j] * model.dClientes[i,j] for i in model.Clientes for j in model.Clientes) + sum((model.xDestino[i] * model.dDestino[i]) + (model.xMotorista[i] * model.dMotorista[i]) for i in model.Clientes))
        
        if(True):
            model.objective = pyEnv.Objective(rule=media_caminho, sense=pyEnv.minimize)
        else:    
            model.objective = pyEnv.Objective(rule=menor_caminho, sense=pyEnv.minimize)

        def visitar(model):
            return sum(model.xMotorista[i] for i in model.Clientes) == 1

        model.const1 = pyEnv.Constraint(rule=visitar)

        def sair(model):
            return sum(model.xDestino[i] for i in model.Clientes) == 1

        model.const2 = pyEnv.Constraint(rule=sair)

        def visitarCliente(model, Clientes):
            return (sum(model.xClientes[i, Clientes] for i in model.Clientes if i!=Clientes) + model.xMotorista[Clientes]) == 1

        model.const3 = pyEnv.Constraint(model.Clientes, rule=visitarCliente)

        def sairCliente(model, Clientes):
            return (sum(model.xClientes[Clientes, i] for i in model.Clientes if i!=Clientes) + model.xDestino[Clientes]) == 1

        model.const4 = pyEnv.Constraint(model.Clientes, rule=sairCliente)

        def rule_const3(model, i, j):
            if i!=j: 
                return model.u[i] - model.u[j] + model.xClientes[i,j] * n <= n-1
            else:
                #Yeah, this else doesn't say anything
                return model.u[i] - model.u[i] == 0 
            
        model.const5 = pyEnv.Constraint(model.U, model.Clientes, rule=rule_const3)

        solver = pyEnv.SolverFactory('cplex', executable='C:\Program Files\IBM\ILOG\CPLEX_Studio_Community201\cplex\\bin\\x64_win64\cplex')
        result = solver.solve(model, tee = False)

        print(result.problem.lower_bound)

        ordem = []
        l = list(model.xMotorista.keys())
        for i in l:
            if model.xMotorista[i]() == 1:
                print(i)
                ordem.append({'name': lugares[i-1].name, 'latitude': lugares[i-1].latitude, 'longitude': lugares[i-1].longitude,'id': i})

        l = list(model.xClientes.keys())
        for i in l:
            for j in l:
                if model.xClientes[j]() == 1 and j[0] == ordem[-1]['id']:
                    print(j)
                    ordem.append({'name': lugares[j[1]-1].name, 'latitude': lugares[j[1]-1].latitude, 'longitude': lugares[j[1]-1].longitude,'id': j[1]})

        l = list(model.xDestino.keys())
        for i in l:
            if model.xDestino[i]() == 1:
                print(i)
            
        ordem.append({'name': destino[0].name, 'latitude': destino[0].latitude, 'longitude': destino[0].longitude,'id': n+1})
        return JsonResponse(ordem, safe=False)

    