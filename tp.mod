set Clientes ordered;
param n := card{Clientes};

set BITS_OF_THE_SUBSETS := 0 .. (2**n - 1);
set SUBSETS {k in BITS_OF_THE_SUBSETS} := {i in Clientes: (k div 2**(ord(i)-1)) mod 2 = 1};

param dClientes{Clientes, Clientes} >= 0;
param dMotorista{Clientes} >= 0;
param dDestino{Clientes} >= 0;

var XClientes {Clientes, Clientes} binary;
var XMotorista{Clientes} binary;
var XDestino{Clientes} binary;

#minimize menorCaminho:
# sum {i in Clientes, j in Clientes}(dClientes[i, j] * XClientes[i, j]) +
# sum{i in Clientes}(dMotorista[i] * XMotorista[i] + dDestino[i] * XDestino[i]);

minimize mediaCaminho:
 (sum {i in Clientes, j in Clientes}(dClientes[i, j] * XClientes[i, j]) +
 sum{i in Clientes}(dDestino[i] * XDestino[i]))/n; 

subject to visitar:
sum {i in Clientes} XMotorista[i] = 1;

subject to sair:
sum {i in Clientes} XDestino[i] = 1;

subject to visitarCliente {j in Clientes}:
sum {i in Clientes} (XClientes[i,j]) + XMotorista[j] = 1;

subject to sairCliente {i in Clientes}:
sum {j in Clientes} (XClientes[i,j]) + XDestino[i] = 1;


subject to Rest1{i in Clientes}: sum {j in Clientes: i = j} XClientes[i,j] = 0;

#Não criar ciclos
subj to SubtourElim {k in BITS_OF_THE_SUBSETS diff {0, 2**n - 1}}:
   sum {i in SUBSETS[k], j in SUBSETS[k]} XClientes[i,j] <= card{SUBSETS[k]} - 1;
